export const mapErrorCodeToMessage = (code?: string) => {
  switch (code) {
    case 'UNAUTHENTICATED':
      return 'Please login again';
    case 'UNAUTHORIZED':
      return 'You have no permission';
    case 'CITY_LIMIT':
      return 'You can add maximum 10 cities';
    case 'CITY_EXISTS':
      return 'City already exists';
    case 'INVALID_CITY':
      return 'Invalid city name';
    default:
      return 'Something went wrong';
  }
};
