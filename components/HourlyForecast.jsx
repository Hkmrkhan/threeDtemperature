import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, GLASS_CARD, getTempColor } from '../constants/theme';
import WeatherIcon from './WeatherIcon';

export default function HourlyForecast({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  // Get current hour to highlight
  const currentHour = new Date().getHours();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyData.map((item, index) => {
          const isCurrent = item.hour === currentHour;
          return (
            <View
              key={index}
              style={[
                styles.hourItem,
                isCurrent && styles.hourItemActive,
              ]}
            >
              <Text style={[styles.hourLabel, isCurrent && styles.hourLabelActive]}>
                {isCurrent ? 'Now' : item.label}
              </Text>
              <WeatherIcon condition={item.condition} size="sm" />
              <Text style={[styles.hourTemp, { color: getTempColor(item.temp) }]}>
                {item.temp}°
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GLASS_CARD,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  hourItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: 2,
    minWidth: 60,
  },
  hourItemActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  hourLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginBottom: SPACING.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  hourLabelActive: {
    color: COLORS.accentCyan,
    fontWeight: FONT_WEIGHTS.bold,
  },
  hourTemp: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.xs,
  },
});
