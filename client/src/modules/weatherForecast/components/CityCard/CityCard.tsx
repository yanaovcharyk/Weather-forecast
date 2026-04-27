import { Button, Flex, theme } from 'antd';
import { getWeatherBackground, getNextDays } from '../../utils';
import { CloseOutlined } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import { InfoCard } from '@/modules/common/components/Card/InfoCard';
import { useSmartBackground } from '@/modules/common/hooks';
import type { City } from '../../../common/types';
import Title from 'antd/es/typography/Title';

export interface CityCardProps {
  city: string;
  weather: City['weather'];
  onRemove: () => void;
  loading?: boolean;
}

export const CityCard = ({
  city,
  weather,
  onRemove,
  loading,
}: CityCardProps) => {
  const { token } = theme.useToken();

  const background = getWeatherBackground(weather?.description);
  const { loaded } = useSmartBackground(background);

  const days = getNextDays(4);

  return (
    <InfoCard
      headerLeft={
        <Title level={5} style={{ margin: 0 }}>
          {city}
        </Title>
      }
      headerRight={
        <Button
          type="text"
          loading={loading}
          onClick={onRemove}
          icon={
            <CloseOutlined
              style={{
                color: token.colorTextHeading,
              }}
            />
          }
        />
      }
    >
      {weather ? (
        <div
          style={{
            position: 'relative',
            padding: '8px 16px 16px',
            minHeight: 160,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',

              opacity: loaded ? 1 : 0,

              transition: 'opacity 0.6s ease',
              transform: 'scale(1.05)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
            }}
          />

          <Flex
            vertical
            align="center"
            justify="center"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              {weather.temperature}°C
            </Text>

            <Text style={{ fontSize: token.fontSizeLG }}>
              {weather.description}
            </Text>

            <Text strong style={{ marginTop: 8, alignSelf: 'flex-start' }}>
              Next days
            </Text>

            <Flex vertical gap={2} style={{ width: '100%' }}>
              {weather.next3DaysTemperature?.map((t, i) => (
                <Flex
                  key={i}
                  justify="space-between"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    padding: '0',
                  }}
                >
                  <Text style={{ fontSize: token.fontSizeSM }}>
                    {days[i + 1]?.label}
                  </Text>
                  <Text style={{ fontSize: token.fontSizeSM }}>
                    {weather.next3DaysDescription?.[i]} {t}°C
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <Text type="secondary">No forecast yet</Text>
        </div>
      )}
    </InfoCard>
  );
};
