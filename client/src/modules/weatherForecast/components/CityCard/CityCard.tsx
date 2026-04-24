import { Flex } from 'antd';
import { Text } from '@/shared/components';
import { TextButton } from '@/shared/components/Button/TextButton';
import { InfoCard } from '@/shared/components/Card/InfoCard';
import { getWeatherBackground } from './getWeatherBackground';
import type { City } from '../../../../shared/types';
import { theme } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getNextDays } from '../../utils/getNextDays';

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
  const background = getWeatherBackground(weather?.description);
  const { token } = theme.useToken();

  const days = getNextDays(4);

  return (
    <InfoCard
      headerLeft={
        <Text
          strong
          style={{ fontSize: token.fontSizeXL, color: token.colorTextHeading }}
        >
          {city}
        </Text>
      }
      headerRight={
        <TextButton
          loading={loading}
          onClick={onRemove}
          style={{
            width: 16,
            height: 16,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            fontSize: 12,
            color: token.colorTextHeading,
          }}
        >
          <CloseOutlined style={{ fontSize: token.fontSizeLG }} />
        </TextButton>
      }
    >
      {weather ? (
        <div
          style={{
            padding: '8px 16px 16px',
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
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
            gap={0}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {weather.temperature}°C
            </Text>

            <Text style={{ fontSize: token.fontSizeLG, lineHeight: 1 }}>
              {weather.description}
            </Text>

            <Text
              strong
              style={{
                fontSize: token.fontSizeLG,
                alignSelf: 'flex-start',
                marginTop: token.marginXXS,
                padding: 0,
              }}
            >
              Next days
            </Text>

            <Flex vertical gap={2} style={{ width: '100%' }}>
              {weather.next3DaysTemperature?.map((t, i) => (
                <Flex
                  key={i}
                  align="center"
                  justify="space-between"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    padding: '3px 0',
                  }}
                >
                  <Text
                    strong
                    style={{ fontSize: token.fontSizeSM, lineHeight: 1 }}
                  >
                    {days[i + 1]?.label}
                  </Text>
                  <Flex align="center" gap={6}>
                    <Text
                      style={{
                        fontSize: token.fontSizeSM,
                        opacity: 0.8,
                        lineHeight: 1,
                      }}
                    >
                      {weather.next3DaysDescription?.[i]}
                    </Text>

                    <Text
                      strong
                      style={{
                        fontSize: token.fontSizeSM,
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {t}°C
                    </Text>
                  </Flex>
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
