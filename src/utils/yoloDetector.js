import * as ort from 'onnxruntime-web';

// Configurable confidence threshold for human/person detection (Prompt Requirement 3)
export const PERSON_CONFIDENCE_THRESHOLD = 0.50;

// Path to locally hosted lightweight YOLO11n model
export const YOLO_MODEL_PATH = '/models/yolo11n.onnx';

// Official remote fallback URL for YOLO11n ONNX model
export const YOLO_REMOTE_FALLBACK_URL = 
  'https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.onnx';

// Model input dimensions
const INPUT_WIDTH = 640;
const INPUT_HEIGHT = 640;
const COCO_PERSON_CLASS_INDEX = 0; // Class 0 in COCO 80 classes is "person"

let cachedSession = null;
let isModelLoading = false;

// Configure ONNX Runtime Web WASM environment for CPU execution
if (typeof window !== 'undefined') {
  try {
    ort.env.wasm.numThreads = 1; // Single-thread WASM: zero SharedArrayBuffer header requirements
    ort.env.wasm.simd = true;
    // Serve WASM binaries directly from CDN matching installed onnxruntime-web version
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';
  } catch (e) {
    console.warn('ORT env configuration warning:', e);
  }
}

/**
 * Loads the lightweight YOLO11n ONNX model once and caches the session.
 * Reuses the cached session when Protection is re-armed (Requirement 11).
 */
export async function loadYoloModel() {
  if (cachedSession) {
    return cachedSession;
  }
  if (isModelLoading) {
    while (isModelLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (cachedSession) return cachedSession;
  }

  isModelLoading = true;
  try {
    // 1. Attempt loading locally hosted model buffer
    let modelSource = YOLO_MODEL_PATH;
    if (typeof window !== 'undefined') {
      const response = await fetch(YOLO_MODEL_PATH);
      if (!response.ok) {
        throw new Error(`Failed to fetch model from ${YOLO_MODEL_PATH}: HTTP ${response.status}`);
      }
      modelSource = await response.arrayBuffer();
    }

    const session = await ort.InferenceSession.create(modelSource, {
      executionProviders: ['wasm']
    });
    cachedSession = session;
    return session;
  } catch (primaryError) {
    console.warn('Local YOLO11n load failed, trying remote fallback...', primaryError);
    try {
      // 2. Fallback to official Ultralytics release asset URL
      let fallbackSource = YOLO_REMOTE_FALLBACK_URL;
      if (typeof window !== 'undefined') {
        const response = await fetch(YOLO_REMOTE_FALLBACK_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch remote model: HTTP ${response.status}`);
        }
        fallbackSource = await response.arrayBuffer();
      }

      const session = await ort.InferenceSession.create(fallbackSource, {
        executionProviders: ['wasm']
      });
      cachedSession = session;
      return session;
    } catch (fallbackError) {
      console.error('All YOLO model load attempts failed:', fallbackError);
      throw fallbackError;
    }
  } finally {
    isModelLoading = false;
  }
}

/**
 * Calculates Intersection over Union (IoU) between two boxes
 */
function calculateIoU(boxA, boxB) {
  const xA = Math.max(boxA.x1, boxB.x1);
  const yA = Math.max(boxA.y1, boxB.y1);
  const xB = Math.min(boxA.x1 + boxA.w, boxB.x1 + boxB.w);
  const yB = Math.min(boxA.y1 + boxA.h, boxB.y1 + boxB.h);

  const interW = Math.max(0, xB - xA);
  const interH = Math.max(0, yB - yA);
  const interArea = interW * interH;

  const boxAArea = boxA.w * boxA.h;
  const boxBArea = boxB.w * boxB.h;

  return interArea / (boxAArea + boxBArea - interArea);
}

/**
 * Non-Maximum Suppression (NMS) to eliminate duplicate overlapping person detections
 */
export function nonMaxSuppression(boxes, iouThreshold = 0.45) {
  if (!boxes || boxes.length === 0) return [];
  boxes.sort((a, b) => b.confidence - a.confidence);

  const selected = [];
  for (const box of boxes) {
    let keep = true;
    for (const chosen of selected) {
      if (calculateIoU(box, chosen) > iouThreshold) {
        keep = false;
        break;
      }
    }
    if (keep) {
      selected.push(box);
    }
  }
  return selected;
}

// Reusable offscreen canvas for preprocessing to avoid garbage collection pressure
let offscreenCanvas = null;
let offscreenCtx = null;

function getOffscreenCanvas() {
  if (!offscreenCanvas && typeof document !== 'undefined') {
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = INPUT_WIDTH;
    offscreenCanvas.height = INPUT_HEIGHT;
    offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }
  return { canvas: offscreenCanvas, ctx: offscreenCtx };
}

/**
 * Runs lightweight inference on current video frame and detects "person" class only.
 * Ignores all non-human classes (cars, animals, objects).
 */
export async function detectPersons(session, videoElement, confidenceThreshold = PERSON_CONFIDENCE_THRESHOLD) {
  if (!session || !videoElement || videoElement.readyState < 2 || !videoElement.videoWidth) {
    return [];
  }

  const { ctx } = getOffscreenCanvas();
  if (!ctx) return [];

  // Draw scaled video frame to 640x640 offscreen canvas
  ctx.drawImage(videoElement, 0, 0, INPUT_WIDTH, INPUT_HEIGHT);
  const imageData = ctx.getImageData(0, 0, INPUT_WIDTH, INPUT_HEIGHT);
  const pixels = imageData.data;
  const totalPixels = INPUT_WIDTH * INPUT_HEIGHT;

  // Convert to RGB float32 tensor normalized to [0, 1] in CHW order
  const inputData = new Float32Array(3 * totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    inputData[i] = pixels[i * 4] / 255.0; // Red
    inputData[totalPixels + i] = pixels[i * 4 + 1] / 255.0; // Green
    inputData[2 * totalPixels + i] = pixels[i * 4 + 2] / 255.0; // Blue
  }

  const inputTensor = new ort.Tensor('float32', inputData, [1, 3, INPUT_WIDTH, INPUT_HEIGHT]);
  const results = await session.run({ images: inputTensor });
  const output = results.output0.data; // Output shape: [1, 84, 8400]

  const candidateBoxes = [];
  const numAnchors = 8400;

  // Class 0 is "person" in COCO dataset
  // In YOLO11 / YOLOv8: row 0=cx, 1=cy, 2=w, 3=h, row 4=class 0 score
  const personRowOffset = (4 + COCO_PERSON_CLASS_INDEX) * numAnchors;

  for (let col = 0; col < numAnchors; col++) {
    const score = output[personRowOffset + col];
    if (score >= confidenceThreshold) {
      const cx = output[0 * numAnchors + col];
      const cy = output[1 * numAnchors + col];
      const w = output[2 * numAnchors + col];
      const h = output[3 * numAnchors + col];

      const x1 = cx - w / 2;
      const y1 = cy - h / 2;

      candidateBoxes.push({
        x1,
        y1,
        w,
        h,
        confidence: score,
        label: 'PERSON'
      });
    }
  }

  return nonMaxSuppression(candidateBoxes, 0.45);
}

/**
 * Draws cybersecurity-styled bounding boxes with tactical corner reticles
 * and 'PERSON \n Confidence: XX%' label on transparent overlay canvas.
 */
export function drawDetections(canvas, detections) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear previous frame bounding boxes
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!detections || detections.length === 0) return;

  const scaleX = canvas.width / INPUT_WIDTH;
  const scaleY = canvas.height / INPUT_HEIGHT;

  detections.forEach((det) => {
    const rawBoxX = det.x1 * scaleX;
    const rawBoxY = det.y1 * scaleY;
    const boxW = Math.max(16, det.w * scaleX);
    const boxH = Math.max(16, det.h * scaleY);

    // Because the video has CSS transform: scaleX(-1) (mirrored webcam),
    // mirror the box horizontally to align with user body position,
    // while leaving the label text drawn left-to-right upright!
    const drawX = canvas.width - (rawBoxX + boxW);
    const drawY = Math.max(0, rawBoxY);

    // 1. Glowing Bounding Box
    ctx.strokeStyle = '#10b981'; // Cyber emerald
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
    ctx.shadowBlur = 8;
    ctx.strokeRect(drawX, drawY, boxW, boxH);

    // Subtle translucent tint
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(drawX, drawY, boxW, boxH);

    // Reset shadow
    ctx.shadowBlur = 0;

    // 2. Tactical Corner HUD Brackets
    const cornerLen = Math.min(14, boxW * 0.25, boxH * 0.25);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(drawX, drawY + cornerLen);
    ctx.lineTo(drawX, drawY);
    ctx.lineTo(drawX + cornerLen, drawY);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(drawX + boxW - cornerLen, drawY);
    ctx.lineTo(drawX + boxW);
    ctx.lineTo(drawX + boxW, drawY + cornerLen);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(drawX, drawY + boxH - cornerLen);
    ctx.lineTo(drawX, drawY + boxH);
    ctx.lineTo(drawX + cornerLen, drawY + boxH);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(drawX + boxW - cornerLen, drawY + boxH);
    ctx.lineTo(drawX + boxW, drawY + boxH);
    ctx.lineTo(drawX + boxW, drawY + boxH - cornerLen);
    ctx.stroke();

    // 3. Label Badge:
    // ┌─────────────────────┐
    // │ PERSON              │
    // │ Confidence: 94%     │
    // └─────────────────────┘
    const labelTitle = 'PERSON';
    const labelConf = `Confidence: ${Math.round(det.confidence * 100)}%`;

    const badgeWidth = 114;
    const badgeHeight = 36;
    let badgeY = drawY - badgeHeight - 4;
    if (badgeY < 4) {
      badgeY = drawY + 4; // place inside top if near canvas upper border
    }
    const badgeX = Math.max(4, Math.min(drawX, canvas.width - badgeWidth - 4));

    // Badge Background Pill
    ctx.fillStyle = 'rgba(8, 14, 26, 0.92)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 5);
    } else {
      ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
    }
    ctx.fill();
    ctx.stroke();

    // Title line
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(labelTitle, badgeX + 8, badgeY + 14);

    // Confidence percentage line
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillText(labelConf, badgeX + 8, badgeY + 28);
  });
}
