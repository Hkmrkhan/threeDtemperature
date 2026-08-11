// Design tokens for the 3D Temp Weather App
// Dark theme with atmospheric gradients and glassmorphism

export const COLORS = {
  // Backgrounds
  bgPrimary: '#060B1A',
  bgSecondary: '#0D1332',
  bgTertiary: '#141A3E',
  bgCard: 'rgba(20, 26, 62, 0.65)',
  bgCardBorder: 'rgba(100, 120, 255, 0.15)',

  // Accent
  accentCyan: '#00D4FF',
  accentPurple: '#7B61FF',
  accentBlue: '#3B82F6',
  accentPink: '#FF61D8',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',
  textAccent: '#00D4FF',

  // Temperature scale
  tempFreezing: '#4FC3F7',  // < 0°C
  tempCold: '#29B6F6',      // 0-10°C
  tempCool: '#26C6DA',      // 10-18°C
  tempMild: '#66BB6A',      // 18-24°C
  tempWarm: '#FFA726',      // 24-32°C
  tempHot: '#EF5350',       // 32-40°C
  tempExtreme: '#D32F2F',   // > 40°C

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // Tab bar
  tabBarBg: 'rgba(6, 11, 26, 0.92)',
  tabBarBorder: 'rgba(100, 120, 255, 0.12)',
  tabActive: '#00D4FF',
  tabInactive: 'rgba(255, 255, 255, 0.35)',

  // Globe
  globeOcean: '#0A2463',
  globeLand: '#1B5E20',
  globeAtmosphere: 'rgba(0, 212, 255, 0.15)',
  globeMarkerGlow: '#00D4FF',
};

export const GRADIENTS = {
  backgroundMain: ['#060B1A', '#0D1332', '#141A3E'],
  cardGlass: ['rgba(20, 26, 62, 0.7)', 'rgba(20, 26, 62, 0.3)'],
  accentLine: ['#00D4FF', '#7B61FF'],
  hotTemp: ['#FF6B35', '#EF5350', '#D32F2F'],
  coldTemp: ['#4FC3F7', '#29B6F6', '#0288D1'],
  atmosphere: ['rgba(0, 212, 255, 0.0)', 'rgba(0, 212, 255, 0.15)', 'rgba(0, 212, 255, 0.0)'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 56,
  mega: 72,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// Utility: Get temperature color based on value
export const getTempColor = (temp) => {
  if (temp < 0) return COLORS.tempFreezing;
  if (temp < 10) return COLORS.tempCold;
  if (temp < 18) return COLORS.tempCool;
  if (temp < 24) return COLORS.tempMild;
  if (temp < 32) return COLORS.tempWarm;
  if (temp < 40) return COLORS.tempHot;
  return COLORS.tempExtreme;
};

// Card glassmorphism style preset
export const GLASS_CARD = {
  backgroundColor: COLORS.bgCard,
  borderWidth: 1,
  borderColor: COLORS.bgCardBorder,
  borderRadius: BORDER_RADIUS.lg,
};
