import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, GLASS_CARD, getTempColor } from '../constants/theme';
import WeatherIcon from './WeatherIcon';

export default function WeeklyForecast({ weeklyData }) {
  if (!weeklyData || weeklyData.length === 0) return null;

  // Find global min/max for the bar visualization
  const allTemps = weeklyData.flatMap((d) => [d.high, d.low]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Forecast</Text>
      {weeklyData.map((item, index) => {
        const lowPercent = ((item.low - globalMin) / range) * 100;
        const highPercent = ((item.high - globalMin) / range) * 100;
        const barLeft = lowPercent;
        const barWidth = highPercent - lowPercent;

        return (
          <View key={index} style={styles.dayRow}>
            <Text style={styles.dayName}>{item.day}</Text>
            <View style={styles.iconContainer}>
              <WeatherIcon condition={item.condition} size="sm" />
            </View>
            <Text style={[styles.tempLow, { color: getTempColor(item.low) }]}>
              {item.low}°
            </Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 8)}%`,
                    backgroundColor: getTempColor((item.high + item.low) / 2),
                  },
                ]}
              />
            </View>
            <Text style={[styles.tempHigh, { color: getTempColor(item.high) }]}>
              {item.high}°
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GLASS_CARD,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayName: {
    width: 40,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
  },
  tempLow: {
    width: 36,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    marginHorizontal: SPACING.sm,
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    top: 0,
  },
  tempHigh: {
    width: 36,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'left',
  },
});
