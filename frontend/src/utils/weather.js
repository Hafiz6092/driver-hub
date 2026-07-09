// Open-Meteo sends a numeric weather code, but the UI needs readable text.
// This map is the translation layer between the API response and the weather card.
const WEATHER_CODE_MAP = {
  0: { condition: 'Clear', description: 'Clear sky' },
  1: { condition: 'Mostly Clear', description: 'Mostly clear' },
  2: { condition: 'Partly Cloudy', description: 'Partly cloudy' },
  3: { condition: 'Cloudy', description: 'Overcast' },
  45: { condition: 'Fog', description: 'Foggy conditions' },
  48: { condition: 'Fog', description: 'Rime fog' },
  51: { condition: 'Drizzle', description: 'Light drizzle' },
  53: { condition: 'Drizzle', description: 'Moderate drizzle' },
  55: { condition: 'Drizzle', description: 'Dense drizzle' },
  56: { condition: 'Freezing Drizzle', description: 'Light freezing drizzle' },
  57: { condition: 'Freezing Drizzle', description: 'Dense freezing drizzle' },
  61: { condition: 'Rain', description: 'Light rain' },
  63: { condition: 'Rain', description: 'Moderate rain' },
  65: { condition: 'Rain', description: 'Heavy rain' },
  66: { condition: 'Freezing Rain', description: 'Light freezing rain' },
  67: { condition: 'Freezing Rain', description: 'Heavy freezing rain' },
  71: { condition: 'Snow', description: 'Light snowfall' },
  73: { condition: 'Snow', description: 'Moderate snowfall' },
  75: { condition: 'Snow', description: 'Heavy snowfall' },
  77: { condition: 'Snow', description: 'Snow grains' },
  80: { condition: 'Rain Showers', description: 'Light rain showers' },
  81: { condition: 'Rain Showers', description: 'Moderate rain showers' },
  82: { condition: 'Rain Showers', description: 'Violent rain showers' },
  85: { condition: 'Snow Showers', description: 'Light snow showers' },
  86: { condition: 'Snow Showers', description: 'Heavy snow showers' },
  95: { condition: 'Thunderstorm', description: 'Thunderstorm' },
  96: { condition: 'Thunderstorm', description: 'Thunderstorm with light hail' },
  99: { condition: 'Thunderstorm', description: 'Thunderstorm with heavy hail' },
};

const getWeatherSummary = (code) => {
  // Unknown codes fall back to a safe generic label.
  return WEATHER_CODE_MAP[code] || {
    condition: 'Unknown',
    description: 'Current conditions unavailable',
  };
};

// Turns an ISO date string ("2026-07-09") into a short day label.
// Today gets a special "Today" label instead of its weekday name.
const getDayLabel = (isoDate, index) => {
  if (index === 0) {
    return 'Today';
  }

  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('default', { weekday: 'short' });
};

export async function fetchWeather(lat, lon) {
  try {
    // Ask Open-Meteo for current conditions plus a 4-day daily forecast
    // (today + next 3 days). timezone=auto keeps the daily buckets aligned
    // to the driver's local day instead of UTC.
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&forecast_days=4&timezone=auto` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    if (!current) {
      throw new Error('Weather API returned no current data.');
    }

    // Translate the current weather code into readable labels before returning it.
    const currentSummary = getWeatherSummary(current.weather_code);

    // Build the forecast array (today + next 3 days) if the API returned daily data.
    const forecast = daily && Array.isArray(daily.time)
      ? daily.time.map((isoDate, index) => {
          const summary = getWeatherSummary(daily.weather_code[index]);

          return {
            date: isoDate,
            dayLabel: getDayLabel(isoDate, index),
            condition: summary.condition,
            description: summary.description,
            high: Math.round(daily.temperature_2m_max[index]),
            low: Math.round(daily.temperature_2m_min[index]),
          };
        })
      : [];

    // Return a small cleaned-up object instead of exposing the raw API response.
    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: currentSummary.condition,
      description: currentSummary.description,
      windSpeed: Math.round(current.wind_speed_10m),
      isDay: Boolean(current.is_day),
      locationLabel: 'Your area',
      // forecast[0] is today, forecast[1..3] are the next three days.
      forecast,
    };
  } catch (error) {
    // The component handles null by showing a fallback message.
    console.error('Failed to gather weather metadata:', error.message);
    return null;
  }
}