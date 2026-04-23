type WeatherConditionMapping = {
  matchesCondition: (description: string) => boolean;
  background: string;
};

const weatherConditionMappings: WeatherConditionMapping[] = [
  {
    matchesCondition: (d) => d.includes('clear'),
    background: '/images/weather/clear.webp',
  },

  {
    matchesCondition: (d) => d.includes('few clouds'),
    background: '/images/weather/few-clouds.webp',
  },
  {
    matchesCondition: (d) => d.includes('scattered'),
    background: '/images/weather/scattered-clouds.webp',
  },
  {
    matchesCondition: (d) => d.includes('broken'),
    background: '/images/weather/broken-clouds.webp',
  },
  {
    matchesCondition: (d) => d.includes('overcast'),
    background: '/images/weather/overcast.webp',
  },

  {
    matchesCondition: (d) => d.includes('drizzle') || d.includes('light rain'),
    background: '/images/weather/drizzle.webp',
  },
  {
    matchesCondition: (d) => d.includes('rain'),
    background: '/images/weather/rain.webp',
  },

  {
    matchesCondition: (d) => d.includes('thunderstorm'),
    background: '/images/weather/storm.webp',
  },

  {
    matchesCondition: (d) => d.includes('snow'),
    background: '/images/weather/snow.webp',
  },
  {
    matchesCondition: (d) => d.includes('sleet'),
    background: '/images/weather/sleet.webp',
  },

  {
    matchesCondition: (d) =>
      d.includes('mist') ||
      d.includes('fog') ||
      d.includes('haze') ||
      d.includes('smoke'),
    background: '/images/weather/mist.webp',
  },

  {
    matchesCondition: (d) =>
      d.includes('dust') || d.includes('sand') || d.includes('ash'),
    background: '/images/weather/dust.webp',
  },

  {
    matchesCondition: (d) => d.includes('tornado'),
    background: '/images/weather/tornado.webp',
  },
  {
    matchesCondition: (d) => d.includes('squall'),
    background: '/images/weather/wind.webp',
  },
];

export const getWeatherBackground = (description?: string) => {
  if (!description) {
    return '/images/weather/default.webp';
  }

  const normalized = description.toLowerCase();

  const rule = weatherConditionMappings.find((r) =>
    r.matchesCondition(normalized),
  );

  return rule?.background ?? '/images/weather/default.webp';
};
