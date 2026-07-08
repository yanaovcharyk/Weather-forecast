const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getNextDays = (count: number = 7) => {
  const today = new Date();

  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i + 1);

    return {
      label: WEEK_DAYS[date.getDay()],
      date,
    };
  });
};
