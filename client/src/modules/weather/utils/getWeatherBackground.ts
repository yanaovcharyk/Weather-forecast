type WeatherConditionMapping = {
  keywords: string[];
  background: string;
};

const weatherConditionMappings: WeatherConditionMapping[] = [
  { keywords: ['clear'], background: '/images/weather/clear.webp' },
  { keywords: ['few clouds'], background: '/images/weather/few-clouds.webp' },
  {
    keywords: ['scattered'],
    background: '/images/weather/scattered-clouds.webp',
  },
  { keywords: ['broken'], background: '/images/weather/broken-clouds.webp' },
  { keywords: ['overcast'], background: '/images/weather/overcast.webp' },
  {
    keywords: ['drizzle', 'light rain'],
    background: '/images/weather/drizzle.webp',
  },
  { keywords: ['rain'], background: '/images/weather/rain.webp' },
  { keywords: ['thunderstorm'], background: '/images/weather/storm.webp' },
  { keywords: ['snow'], background: '/images/weather/snow.webp' },
  { keywords: ['sleet'], background: '/images/weather/sleet.webp' },
  {
    keywords: ['mist', 'fog', 'haze', 'smoke'],
    background: '/images/weather/mist.webp',
  },
  {
    keywords: ['dust', 'sand', 'ash'],
    background: '/images/weather/dust.webp',
  },
  { keywords: ['tornado'], background: '/images/weather/tornado.webp' },
  { keywords: ['squall'], background: '/images/weather/wind.webp' },
];

export const getWeatherBackground = (description?: string) => {
  if (!description) {
    return '/images/weather/default.webp';
  }

  const normalized = description.toLowerCase();

  const rule = weatherConditionMappings.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  return rule?.background ?? '/images/weather/default.webp';
};
