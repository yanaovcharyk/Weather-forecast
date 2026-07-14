const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type NextDay = {
  weekDay: string;
  date: Date;
};

export const getNextDays = (numberOfDays: number = 7): NextDay[] => {
  const today = new Date();

  return Array.from({ length: numberOfDays }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i + 1);

    return {
      weekDay: WEEK_DAYS[date.getDay()],
      date,
    };
  });
};
