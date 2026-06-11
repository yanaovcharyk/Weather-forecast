import { CityEntity } from '@cities/entities';

export const KyivCity = {
  id: 1,
  userId: 'u1',
  city: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  isPinned: false,
};

export const LvivCity = {
  id: 2,
  userId: 'u1',
  city: 'Lviv',
  lat: 49,
  lon: 24,
  isPinned: false,
};

export const OdesaCity = {
  id: 3,
  userId: 'u1',
  city: 'Odesa',
  lat: 46.48,
  lon: 30.73,
  isPinned: false,
};

export const KharkivCity = {
  id: 4,
  userId: 'u1',
  city: 'Kharkiv',
  lat: 49.99,
  lon: 36.23,
  isPinned: false,
};

export const DniproCity = {
  id: 5,
  userId: 'u1',
  city: 'Dnipro',
  lat: 48.46,
  lon: 35.04,
  isPinned: false,
};

export const PinnedDniproCity = {
  ...DniproCity,
  isPinned: true,
};
