export const formatDate = (dateString) => {
  // Defensive guard so the UI does not crash on a missing date.
  if (!dateString) return '';

  // Stored dates come in as YYYY-MM-DD from the date input.
  // We flip that into MM/DD/YYYY for display.
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};
