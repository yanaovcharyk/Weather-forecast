import { Button } from 'antd';
import { AppCard } from '@/common/components';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const BackToAllCitiesButton = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleBack = () => {
    navigate(`/?${params.toString()}`);
  };
  return (
    <AppCard>
      <Button type="default" onClick={handleBack}>
        ← Back to all cities
      </Button>
    </AppCard>
  );
};
