import { render } from '@testing-library/react';

import { CitiesList } from '@/weather/components/CitiesList/CitiesList';

export const setupCitiesList = () => render(<CitiesList />);
