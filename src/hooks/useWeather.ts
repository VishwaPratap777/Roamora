/* =====================================================
   useWeather — fetch OpenWeatherMap 5-day forecast
   Requires VITE_OPENWEATHER_API_KEY in .env.local
   Falls back gracefully when key is absent.
   ===================================================== */

import { useState, useEffect } from 'react';

export interface DayWeather {
  date: string;           // YYYY-MM-DD
  tempMin: number;        // °C
  tempMax: number;        // °C
  condition: string;      // e.g. "Clear", "Rain"
  description: string;   // e.g. "light rain"
  icon: string;           // OWM icon code e.g. "01d"
  humidity: number;
  windKmh: number;
  pop: number;            // precipitation probability 0-1
}

interface UseWeatherResult {
  forecast: DayWeather[];
  loading: boolean;
  error: string | null;
}

// Simple in-memory cache: key = "city|startDate"
const cache: Map<string, DayWeather[]> = new Map();

function kelvinToCelsius(k: number) {
  return Math.round(k - 273.15);
}

export function useWeather(destination: string, startDate?: string): UseWeatherResult {
  const [forecast, setForecast] = useState<DayWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;

  useEffect(() => {
    if (!apiKey || !destination) return;

    const cacheKey = `${destination}|${startDate || 'now'}`;
    if (cache.has(cacheKey)) {
      setForecast(cache.get(cacheKey)!);
      return;
    }

    setLoading(true);
    setError(null);

    const url =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(destination)}&appid=${apiKey}&cnt=40`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Weather API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Group by day and pick noon reading (or closest)
        const dayMap = new Map<string, DayWeather>();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const item of data.list as any[]) {
          const dateStr: string = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
          const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
          const existing = dayMap.get(dateStr);

          // Prefer 12:00 or 15:00 reading
          if (!existing || Math.abs(hour - 12) < Math.abs(parseInt(existing.date.split('T')[1]?.split(':')[0] || '0') - 12)) {
            dayMap.set(dateStr, {
              date: dateStr,
              tempMin: kelvinToCelsius(item.main.temp_min),
              tempMax: kelvinToCelsius(item.main.temp_max),
              condition: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windKmh: Math.round(item.wind.speed * 3.6),
              pop: Math.round((item.pop || 0) * 100),
            });
          }
        }

        const result = Array.from(dayMap.values()).slice(0, 7);
        cache.set(cacheKey, result);
        setForecast(result);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load weather');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [destination, startDate, apiKey]);

  return { forecast, loading, error };
}

/** Map OWM icon code to a nice emoji */
export function weatherEmoji(icon: string): string {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '🌤️', '02n': '🌤️',
    '03d': '⛅', '03n': '⛅',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[icon] || '🌡️';
}
