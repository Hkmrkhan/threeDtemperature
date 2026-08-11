import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Text } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../../constants/theme';
import { cities } from '../../data/mockWeatherData';
import Globe from '../../components/Globe';
import WeatherCard from '../../components/WeatherCard';
import HourlyForecast from '../../components/HourlyForecast';
import WeeklyForecast from '../../components/WeeklyForecast';

export default function GlobeScreen() {
  const [selectedCityId, setSelectedCityId] = useState('tokyo');

  const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0];

  const handleSelectCity = useCallback((cityId) => {
    setSelectedCityId(cityId);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 3D Weather</Text>
        <Text style={styles.headerSubtitle}>Tap a marker to explore</Text>
      </View>

      {/* 3D Globe */}
      <View style={styles.globeContainer}>
        <Globe
          cities={cities}
          selectedCityId={selectedCityId}
          onSelectCity={handleSelectCity}
        />
      </View>

      {/* Weather Info */}
      <ScrollView
        style={styles.infoContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.infoContent}
      >
        <WeatherCard city={selectedCity} />
        <HourlyForecast hourlyData={selectedCity.hourly} />
        <WeeklyForecast weeklyData={selectedCity.weekly} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    paddingTop: SPACING.xxl + SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  globeContainer: {
    height: 300,
    marginBottom: SPACING.md,
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    paddingBottom: SPACING.xxl,
  },
  bottomSpacer: {
    height: 100,
  },
});
