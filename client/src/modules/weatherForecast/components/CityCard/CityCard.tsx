import { Button, Flex, theme } from 'antd';
import { getWeatherBackground, getNextDays } from '../../utils';
import type { City } from '@/modules/common/types';
import { CloseOutlined } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import { InfoCard } from '@/modules/common/components/Card/InfoCard';

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
        <Button
          type="text"
          loading={loading}
          onClick={onRemove}
          size="small"
          style={{ padding: 4 }}
          icon={
            <CloseOutlined
              style={{ fontSize: token.fontSizeLG, color: token.colorPrimary }}
            />
          }
        />
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
