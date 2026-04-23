const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getNextDays = (count: number = 4) => {
  const today = new Date();

  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);

    return {
      label: WEEK_DAYS[date.getDay()],
      date,
    };
  });
};
