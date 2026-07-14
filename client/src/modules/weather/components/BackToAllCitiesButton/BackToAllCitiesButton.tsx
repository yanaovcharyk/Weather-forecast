import { Button } from 'antd';
import { StyledCard } from '@/common/components';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const BackToAllCitiesButton = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleBack = () => {
    const updatedParams = new URLSearchParams(params);
    updatedParams.delete('existingId');

    const queryString = updatedParams.toString();
    navigate(queryString ? `/?${queryString}` : '/');
  };

  return (
    <StyledCard>
      <Button type="default" onClick={handleBack}>
        ← Back to all cities
      </Button>
    </StyledCard>
  );
};
