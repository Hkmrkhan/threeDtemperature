// Mock weather data for 12 major world cities
// Each city has coordinates for globe placement, current weather, hourly & weekly forecasts

const CONDITIONS = {
  SUNNY: 'sunny',
  PARTLY_CLOUDY: 'partly_cloudy',
  CLOUDY: 'cloudy',
  RAINY: 'rainy',
  STORMY: 'stormy',
  SNOWY: 'snowy',
  FOGGY: 'foggy',
  WINDY: 'windy',
};

const generateHourlyForecast = (baseTemp, condition) => {
  const hours = [];
  const conditions = [CONDITIONS.SUNNY, CONDITIONS.PARTLY_CLOUDY, CONDITIONS.CLOUDY, CONDITIONS.RAINY];
  for (let i = 0; i < 24; i++) {
    const variation = Math.sin((i / 24) * Math.PI * 2) * 5;
    hours.push({
      hour: i,
      label: `${i.toString().padStart(2, '0')}:00`,
      temp: Math.round(baseTemp + variation),
      condition: i >= 6 && i <= 18 ? condition : conditions[Math.floor(Math.random() * 2)],
    });
  }
  return hours;
};

const generateWeeklyForecast = (baseTemp, condition) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const conditions = [CONDITIONS.SUNNY, CONDITIONS.PARTLY_CLOUDY, CONDITIONS.CLOUDY, CONDITIONS.RAINY, CONDITIONS.SNOWY];
  return days.map((day, i) => ({
    day,
    high: Math.round(baseTemp + Math.random() * 6 - 2),
    low: Math.round(baseTemp - 5 + Math.random() * 4 - 2),
    condition: i % 3 === 0 ? conditions[Math.floor(Math.random() * conditions.length)] : condition,
  }));
};

export const cities = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    current: {
      temp: 28,
      feelsLike: 32,
      condition: CONDITIONS.PARTLY_CLOUDY,
      humidity: 72,
      windSpeed: 12,
      uvIndex: 6,
      pressure: 1013,
    },
    hourly: generateHourlyForecast(28, CONDITIONS.PARTLY_CLOUDY),
    weekly: generateWeeklyForecast(28, CONDITIONS.PARTLY_CLOUDY),
  },
  {
    id: 'new_york',
    name: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    lat: 40.7128,
    lng: -74.006,
    current: {
      temp: 24,
      feelsLike: 26,
      condition: CONDITIONS.SUNNY,
      humidity: 55,
      windSpeed: 18,
      uvIndex: 8,
      pressure: 1018,
    },
    hourly: generateHourlyForecast(24, CONDITIONS.SUNNY),
    weekly: generateWeeklyForecast(24, CONDITIONS.SUNNY),
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    flag: '🇬🇧',
    lat: 51.5074,
    lng: -0.1278,
    current: {
      temp: 18,
      feelsLike: 16,
      condition: CONDITIONS.CLOUDY,
      humidity: 78,
      windSpeed: 22,
      uvIndex: 3,
      pressure: 1008,
    },
    hourly: generateHourlyForecast(18, CONDITIONS.CLOUDY),
    weekly: generateWeeklyForecast(18, CONDITIONS.CLOUDY),
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    lat: 48.8566,
    lng: 2.3522,
    current: {
      temp: 22,
      feelsLike: 23,
      condition: CONDITIONS.SUNNY,
      humidity: 60,
      windSpeed: 14,
      uvIndex: 7,
      pressure: 1015,
    },
    hourly: generateHourlyForecast(22, CONDITIONS.SUNNY),
    weekly: generateWeeklyForecast(22, CONDITIONS.SUNNY),
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    lat: 25.2048,
    lng: 55.2708,
    current: {
      temp: 42,
      feelsLike: 48,
      condition: CONDITIONS.SUNNY,
      humidity: 35,
      windSpeed: 20,
      uvIndex: 11,
      pressure: 1005,
    },
    hourly: generateHourlyForecast(42, CONDITIONS.SUNNY),
    weekly: generateWeeklyForecast(42, CONDITIONS.SUNNY),
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    lat: -33.8688,
    lng: 151.2093,
    current: {
      temp: 15,
      feelsLike: 13,
      condition: CONDITIONS.RAINY,
      humidity: 82,
      windSpeed: 28,
      uvIndex: 2,
      pressure: 1002,
    },
    hourly: generateHourlyForecast(15, CONDITIONS.RAINY),
    weekly: generateWeeklyForecast(15, CONDITIONS.RAINY),
  },
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    flag: '🇷🇺',
    lat: 55.7558,
    lng: 37.6173,
    current: {
      temp: -5,
      feelsLike: -12,
      condition: CONDITIONS.SNOWY,
      humidity: 88,
      windSpeed: 15,
      uvIndex: 1,
      pressure: 1020,
    },
    hourly: generateHourlyForecast(-5, CONDITIONS.SNOWY),
    weekly: generateWeeklyForecast(-5, CONDITIONS.SNOWY),
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    lat: 19.076,
    lng: 72.8777,
    current: {
      temp: 33,
      feelsLike: 38,
      condition: CONDITIONS.STORMY,
      humidity: 85,
      windSpeed: 32,
      uvIndex: 5,
      pressure: 998,
    },
    hourly: generateHourlyForecast(33, CONDITIONS.STORMY),
    weekly: generateWeeklyForecast(33, CONDITIONS.STORMY),
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    lat: 30.0444,
    lng: 31.2357,
    current: {
      temp: 38,
      feelsLike: 40,
      condition: CONDITIONS.SUNNY,
      humidity: 25,
      windSpeed: 16,
      uvIndex: 10,
      pressure: 1012,
    },
    hourly: generateHourlyForecast(38, CONDITIONS.SUNNY),
    weekly: generateWeeklyForecast(38, CONDITIONS.SUNNY),
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    flag: '🇧🇷',
    lat: -22.9068,
    lng: -43.1729,
    current: {
      temp: 26,
      feelsLike: 28,
      condition: CONDITIONS.PARTLY_CLOUDY,
      humidity: 70,
      windSpeed: 10,
      uvIndex: 7,
      pressure: 1014,
    },
    hourly: generateHourlyForecast(26, CONDITIONS.PARTLY_CLOUDY),
    weekly: generateWeeklyForecast(26, CONDITIONS.PARTLY_CLOUDY),
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    lat: 43.6532,
    lng: -79.3832,
    current: {
      temp: 20,
      feelsLike: 19,
      condition: CONDITIONS.WINDY,
      humidity: 58,
      windSpeed: 35,
      uvIndex: 5,
      pressure: 1016,
    },
    hourly: generateHourlyForecast(20, CONDITIONS.WINDY),
    weekly: generateWeeklyForecast(20, CONDITIONS.WINDY),
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    lat: 1.3521,
    lng: 103.8198,
    current: {
      temp: 31,
      feelsLike: 36,
      condition: CONDITIONS.FOGGY,
      humidity: 90,
      windSpeed: 8,
      uvIndex: 4,
      pressure: 1010,
    },
    hourly: generateHourlyForecast(31, CONDITIONS.FOGGY),
    weekly: generateWeeklyForecast(31, CONDITIONS.FOGGY),
  },
];

export const CONDITIONS_MAP = CONDITIONS;

export default { cities, CONDITIONS: CONDITIONS_MAP };
