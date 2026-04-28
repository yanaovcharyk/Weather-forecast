import { useState } from 'react';
import { Button, theme } from 'antd';
import { handleResult } from '../../../common/utils';

interface AddCityResult {
  ok: boolean;
  error?: string;
}

interface Props {
  addCity: (city: string) => Promise<AddCityResult>;
}

const CITIES_TO_ADD = ['London', 'Paris', 'Berlin', 'Kyiv', 'Tokyo'];

export const BulkAddCitiesButton = ({ addCity }: Props) => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);

  const handleBulkAdd = async () => {
    setLoading(true);

    try {
      const requests = CITIES_TO_ADD.map((city) => addCity(city));
      const results = await Promise.all(requests);

      results.forEach((result) => {
        handleResult(result, {
          successMessage: 'Bulk request completed',
        });
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      onClick={handleBulkAdd}
      loading={loading}
      style={{
        width: 32,
        height: 32,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorPrimary,
      }}
    >
      ×5
    </Button>
  );
};
