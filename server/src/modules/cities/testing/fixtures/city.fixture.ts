export const KyivCity = {
  id: '1',
  userId: 'u1',
  cityName: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  isPinned: false,
};

export const LvivCity = {
  id: '2',
  userId: 'u1',
  cityName: 'Lviv',
  lat: 49,
  lon: 24,
  isPinned: false,
};

export const OdesaCity = {
  id: '3',
  userId: 'u1',
  cityName: 'Odesa',
  lat: 46.48,
  lon: 30.73,
  isPinned: false,
};

export const KharkivCity = {
  id: '4',
  userId: 'u1',
  cityName: 'Kharkiv',
  lat: 49.99,
  lon: 36.23,
  isPinned: false,
};

export const DniproCity = {
  id: '5',
  userId: 'u1',
  cityName: 'Dnipro',
  lat: 48.46,
  lon: 35.04,
  isPinned: false,
};

export const PinnedDniproCity = {
  ...DniproCity,
  isPinned: true,
};

export const NewDniproCityName = 'New Dnipro';

export const UpdatedDniproCity = {
  ...DniproCity,
  cityName: NewDniproCityName,
  isPinned: true,
};

export const UnpinnedDniproCity = {
  ...PinnedDniproCity,
  isPinned: false,
};

export const UpdateDniproCityParams = {
  id: DniproCity.id,
  userId: DniproCity.userId,
  input: {
    cityName: NewDniproCityName,
    isPinned: true,
  },
};

export const UpdatePinnedDniproCityParams = {
  id: PinnedDniproCity.id,
  userId: PinnedDniproCity.userId,
  input: {
    isPinned: false,
  },
};
