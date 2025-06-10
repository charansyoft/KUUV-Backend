export default function calculateMinutesBetween(startDateTime, endDateTime) {
  // Parse the date-time strings into Date objects
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = end - start;

  // Convert the difference from milliseconds to minutes
  const diffInMinutes = diffInMilliseconds / (1000 * 60);

  // Return the difference in minutes
  return diffInMinutes;
}
