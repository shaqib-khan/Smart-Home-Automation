// Live Weather Service for Lucknow, UP, India using Open-Meteo API (No key required)

const LUCKNOW_LAT = 26.8467;
const LUCKNOW_LON = 80.9462;

export const getWeatherDescription = (code) => {
  const weatherMap = {
    0: { label: 'Clear Sky', icon: 'Sun' },
    1: { label: 'Mainly Clear', icon: 'Sun' },
    2: { label: 'Partly Cloudy', icon: 'CloudSun' },
    3: { label: 'Overcast', icon: 'Cloud' },
    45: { label: 'Foggy', icon: 'CloudFog' },
    48: { label: 'Depositing Rime Fog', icon: 'CloudFog' },
    51: { label: 'Light Drizzle', icon: 'CloudDrizzle' },
    53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle' },
    55: { label: 'Dense Drizzle', icon: 'CloudDrizzle' },
    61: { label: 'Slight Rain', icon: 'CloudRain' },
    63: { label: 'Moderate Rain', icon: 'CloudRain' },
    65: { label: 'Heavy Rain', icon: 'CloudRain' },
    71: { label: 'Slight Snow', icon: 'Snowflake' },
    80: { label: 'Rain Showers', icon: 'CloudRain' },
    81: { label: 'Moderate Showers', icon: 'CloudRain' },
    82: { label: 'Violent Showers', icon: 'CloudRain' },
    95: { label: 'Thunderstorm', icon: 'CloudLightning' },
    96: { label: 'Thunderstorm with Hail', icon: 'CloudLightning' },
    99: { label: 'Heavy Thunderstorm', icon: 'CloudLightning' }
  };
  return weatherMap[code] || { label: 'Partly Cloudy', icon: 'CloudSun' };
};

export const fetchLucknowLiveWeather = async () => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LUCKNOW_LAT}&longitude=${LUCKNOW_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API HTTP error');
    
    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const code = current.weather_code ?? 1;
    const weatherInfo = getWeatherDescription(code);

    return {
      temp: Math.round(current.temperature_2m ?? 32),
      feelsLike: Math.round(current.apparent_temperature ?? 34),
      humidity: current.relative_humidity_2m ?? 65,
      windSpeed: current.wind_speed_10m ?? 12,
      condition: weatherInfo.label,
      iconType: weatherInfo.icon,
      isDay: current.is_day !== 0,
      tempMax: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : 36,
      tempMin: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : 26,
      location: 'Lucknow, UP, India 🇮🇳',
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.warn('Lucknow live weather fetch fallback:', error.message);
    return {
      temp: 32,
      feelsLike: 35,
      humidity: 62,
      windSpeed: 10,
      condition: 'Partly Cloudy',
      iconType: 'CloudSun',
      isDay: true,
      tempMax: 36,
      tempMin: 27,
      location: 'Lucknow, UP, India 🇮🇳',
      isLive: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
