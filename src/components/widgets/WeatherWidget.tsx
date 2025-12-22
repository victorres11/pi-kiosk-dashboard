import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchWeatherData, getWeatherIconUrl } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { WeatherData } from '../../types';
import './WeatherWidget.css';

export function WeatherWidget() {
  const { data, loading, error, lastUpdated } = useDataFetcher<WeatherData>({
    fetchFn: fetchWeatherData,
    refreshInterval: config.refreshIntervals.weather,
    enabled: config.widgets.weather,
  });

  const chartData = useMemo(() => {
    if (!data?.hourly) return [];
    return data.hourly.map((h) => ({
      time: format(h.time, 'ha'),
      temp: h.temp,
    }));
  }, [data?.hourly]);

  if (!config.widgets.weather) return null;

  return (
    <WidgetContainer
      title="Weather"
      icon={<Cloud size={24} />}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      className="weather-widget"
    >
      {data && (
        <>
          <div className="weather-current">
            <div className="weather-main">
              <img
                src={getWeatherIconUrl(data.current.icon)}
                alt={data.current.description}
                className="weather-icon-large"
              />
              <div className="weather-temp-container">
                <span className="weather-temp">{data.current.temp}°</span>
                <span className="weather-description">{data.current.description}</span>
              </div>
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <Thermometer size={18} />
                <span>Feels like {data.current.feelsLike}°</span>
              </div>
              <div className="weather-detail">
                <Droplets size={18} />
                <span>{data.current.humidity}% humidity</span>
              </div>
              <div className="weather-detail">
                <Wind size={18} />
                <span>{data.current.windSpeed} mph wind</span>
              </div>
            </div>
          </div>

          <div className="weather-location">{data.location}</div>

          {chartData.length > 0 && (
            <div className="weather-chart">
              <h4>Today's Forecast</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#60a5fa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="weather-forecast">
            <h4>5-Day Forecast</h4>
            <div className="forecast-days">
              {data.daily.map((day, index) => (
                <div key={index} className="forecast-day">
                  <span className="forecast-date">
                    {index === 0 ? 'Today' : format(day.date, 'EEE')}
                  </span>
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="forecast-icon"
                  />
                  <div className="forecast-temps">
                    <span className="forecast-high">{day.high}°</span>
                    <span className="forecast-low">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </WidgetContainer>
  );
}
