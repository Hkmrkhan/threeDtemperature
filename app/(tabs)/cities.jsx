import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, GLASS_CARD, getTempColor } from '../../constants/theme';
import { cities } from '../../data/mockWeatherData';
import WeatherIcon, { getWeatherInfo } from '../../components/WeatherIcon';

export default function CitiesScreen() {
  const router = useRouter();

  const handleCityPress = (cityId) => {
    // Navigate to globe tab with selected city
    router.push({ pathname: '/(tabs)', params: { cityId } });
  };

  const renderCityCard = ({ item: city }) => {
    const tempColor = getTempColor(city.current.temp);
    const weatherInfo = getWeatherInfo(city.current.condition);

    return (
      <TouchableOpacity
        style={styles.cityCard}
        onPress={() => handleCityPress(city.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.flag}>{city.flag}</Text>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.country}>{city.country}</Text>
            <Text style={styles.condition}>{weatherInfo.label}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.temperature, { color: tempColor }]}>
            {city.current.temp}°
          </Text>
          <WeatherIcon condition={city.current.condition} size="sm" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏙️ World Cities</Text>
        <Text style={styles.headerSubtitle}>
          {cities.length} locations monitored
        </Text>
      </View>

      {/* Cities List */}
      <FlatList
        data={cities}
        renderItem={renderCityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingBottom: SPACING.md,
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
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + 110,
  },
  separator: {
    height: SPACING.sm,
  },
  cityCard: {
    ...GLASS_CARD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  country: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  condition: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.extraBold,
    marginBottom: 4,
  },
});
