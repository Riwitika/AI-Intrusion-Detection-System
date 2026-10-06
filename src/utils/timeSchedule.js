/**
 * Utility functions for time formatting, schedule calculations,
 * midnight-crossing handling, and countdown timer formatting.
 */

// Formats a Date object to 12-hour format with AM/PM (e.g. "9:00 PM", "05:00 AM")
export function formatTime12Hour(date) {
  if (!date || isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Formats a duration in minutes into a human-readable string (e.g. "1 Hour", "8 Hours 30 Mins")
export function formatDurationMinutes(totalMinutes) {
  if (totalMinutes <= 0) return '0 Minutes';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`);
  }
  return parts.length > 0 ? parts.join(' ') : '0 Minutes';
}

// Formats seconds into HH:MM:SS countdown format (e.g. "07:42:15")
export function formatCountdown(totalSeconds) {
  if (totalSeconds == null || totalSeconds < 0) return '00:00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

// Quick Duration calculation (1, 6, 12, 24 Hours)
export function calculateQuickDuration(hours) {
  const now = new Date();
  const end = new Date(now.getTime() + hours * 3600 * 1000);
  const durationMinutes = hours * 60;

  return {
    isValid: true,
    startTime: now,
    endTime: end,
    durationMinutes,
    durationSeconds: hours * 3600,
    startTimeFormatted: formatTime12Hour(now),
    endTimeFormatted: formatTime12Hour(end),
    durationStr: `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`,
    crossesMidnight: now.getDate() !== end.getDate()
  };
}

// "From Now" duration calculation
export function calculateFromNow(minutes, seconds = 0) {
  const now = new Date();
  const totalSeconds = minutes * 60 + seconds;
  const end = new Date(now.getTime() + totalSeconds * 1000);

  let durationStr = '';
  if (minutes > 0) {
    durationStr = formatDurationMinutes(minutes);
  }
  if (seconds > 0) {
    durationStr += (durationStr ? ' ' : '') + `${seconds} Seconds`;
  }
  if (!durationStr) durationStr = '0 Seconds';

  return {
    isValid: totalSeconds > 0,
    startTime: now,
    endTime: end,
    durationMinutes: Math.round(totalSeconds / 60),
    durationSeconds: totalSeconds,
    startTimeFormatted: formatTime12Hour(now),
    endTimeFormatted: formatTime12Hour(end),
    durationStr,
    crossesMidnight: now.getDate() !== end.getDate()
  };
}

// Custom Schedule calculation (Start Time -> End Time)
// Handles overnight schedules that cross midnight (e.g. 9:00 PM -> 5:00 AM)
export function calculateCustomSchedule(startTimeStr, endTimeStr) {
  if (!startTimeStr || !endTimeStr) {
    return { isValid: false, error: 'Please enter both start and end times.' };
  }

  const [sh, sm] = startTimeStr.split(':').map(Number);
  const [eh, em] = endTimeStr.split(':').map(Number);

  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
    return { isValid: false, error: 'Invalid time format.' };
  }

  if (sh === eh && sm === em) {
    return { isValid: false, error: 'Start time and End time cannot be identical.' };
  }

  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0, 0);
  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0, 0);

  // Check if schedule crosses midnight (e.g. 21:00 -> 05:00)
  const crossesMidnight = eh < sh || (eh === sh && em < sm);

  if (crossesMidnight) {
    end = new Date(end.getTime() + 24 * 3600 * 1000);
  }

  // Calculate total session duration
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
  const durationSeconds = diffMinutes * 60;
  const durationStr = formatDurationMinutes(diffMinutes);

  return {
    isValid: true,
    startTime: start,
    endTime: end,
    durationMinutes: diffMinutes,
    durationSeconds,
    startTimeFormatted: formatTime12Hour(start),
    endTimeFormatted: formatTime12Hour(end),
    durationStr,
    crossesMidnight
  };
}
