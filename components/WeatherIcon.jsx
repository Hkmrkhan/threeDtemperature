import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FONT_SIZES } from '../constants/theme';

const ICON_MAP = {
  sunny: { emoji: '☀️', label: 'Sunny' },
  partly_cloudy: { emoji: '⛅', label: 'Partly Cloudy' },
  cloudy: { emoji: '☁️', label: 'Cloudy' },
  rainy: { emoji: '🌧️', label: 'Rainy' },
  stormy: { emoji: '⛈️', label: 'Stormy' },
  snowy: { emoji: '❄️', label: 'Snowy' },
  foggy: { emoji: '🌫️', label: 'Foggy' },
  windy: { emoji: '💨', label: 'Windy' },
};

export const getWeatherInfo = (condition) => {
  return ICON_MAP[condition] || { emoji: '🌡️', label: 'Unknown' };
};

export default function WeatherIcon({ condition, size = 'md' }) {
  const info = getWeatherInfo(condition);
  const fontSize = size === 'lg' ? 48 : size === 'md' ? 32 : 20;

  return <Text style={[styles.icon, { fontSize }]}>{info.emoji}</Text>;
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
