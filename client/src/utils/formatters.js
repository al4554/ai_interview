export const formatPercent = (value) => `${Math.round(value || 0)}%`;

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

export const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};
