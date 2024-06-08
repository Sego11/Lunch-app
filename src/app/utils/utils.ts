// export const baseUrl: string = 'http://localhost:3000/';
export const baseUrl: string = 'https://lunch-backend.onrender.com/';

const days: string[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function getTodayName(date: Date): string {
  let dayIndex = date.getDay();
  const hour = date.getHours();

  if (hour >= 11) {
    dayIndex = (dayIndex + 1) % 7;
  }

  let currentDayName;
  if (dayIndex === 0 || dayIndex === 6) {
    currentDayName = 'monday';
  } else {
    currentDayName = days[dayIndex];
  }
  return currentDayName;
}
