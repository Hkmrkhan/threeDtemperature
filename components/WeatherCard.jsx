import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, GLASS_CARD, getTempColor } from '../constants/theme';
import WeatherIcon, { getWeatherInfo } from './WeatherIcon';

export default function WeatherCard({ city }) {
  if (!city) return null;

  const { current } = city;
  const tempColor = getTempColor(current.temp);
  const weatherInfo = getWeatherInfo(current.condition);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.cityName}>{city.flag} {city.name}</Text>
          <Text style={styles.country}>{city.country}</Text>
        </View>
        <WeatherIcon condition={current.condition} size="lg" />
      </View>

      {/* Temperature */}
      <View style={styles.tempRow}>
        <Text style={[styles.temperature, { color: tempColor }]}>
          {current.temp}°
        </Text>
        <View style={styles.tempDetails}>
          <Text style={styles.conditionLabel}>{weatherInfo.label}</Text>
          <Text style={styles.feelsLike}>Feels like {current.feelsLike}°C</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatItem icon="💧" label="Humidity" value={`${current.humidity}%`} />
        <StatItem icon="💨" label="Wind" value={`${current.windSpeed} km/h`} />
        <StatItem icon="☀️" label="UV Index" value={`${current.uvIndex}`} />
        <StatItem icon="🔽" label="Pressure" value={`${current.pressure} hPa`} />
      </View>
    </View>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...GLASS_CARD,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cityName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  country: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  temperature: {
    fontSize: FONT_SIZES.mega,
    fontWeight: FONT_WEIGHTS.extraBold,
    lineHeight: FONT_SIZES.mega * 1.1,
  },
  tempDetails: {
    marginLeft: SPACING.md,
  },
  conditionLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textPrimary,
  },
  feelsLike: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
  },
});
