# 🌍 3D Temperature & Weather App

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg?style=flat&logo=three.js)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An immersive, interactive **3D Earth Globe Weather Visualizer** built with **Expo**, **React Native**, and **Three.js** (`expo-gl`). Experience real-time and forecasted atmospheric temperatures projected directly onto a photorealistic 3D spinning globe with dynamic heat-color scales, city geolocation markers, and high-fidelity glassmorphic weather cards.

---

## ✨ Features

- **🌐 Interactive 3D Earth Globe**: Rendered in real-time WebGL using **Three.js** and **`expo-gl`**. Supports fluid 360° touch rotation and inertial pan gestures via React Native's `PanResponder`.
- **📍 Geolocation City Markers & Country Flags**: World cities mapped dynamically using spherical trigonometry (latitude/longitude translated into 3D Cartesian vectors) with interactive touch markers.
- **🌡️ Dynamic Temperature Heat Mapping**: Temperature-based color spectrum ranging from freezing cold (`#4FC3F7`) to extreme heat (`#D32F2F`) for instant visual climate perception.
- **📊 Real-Time Atmospheric Metrics**:
  - Current temperature & "Feels Like" index
  - Humidity percentage
  - Wind speed (km/h)
  - UV Index
  - Barometric pressure (hPa)
- **⏱️ 24-Hour Hourly Forecast**: Horizontal scrollable hourly breakdown detailing temperature shifts and changing conditions.
- **📅 7-Day Weekly Forecast**: Comprehensive extended forecast with dynamic high/low temperature bars and condition indicators.
- **🏙️ World Cities Directory**: Fast-access list tab for browsing and switching between global metropolises (Tokyo, New York, London, Paris, Dubai, Sydney, and more).
- **🎨 Atmospheric Glassmorphism UI**: Premium dark cyberpunk aesthetic with frosted glass layers, neon accents, and smooth animations.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Expo](https://expo.dev)** | Universal React framework (SDK 54) |
| **[React Native](https://reactnative.dev)** | Mobile cross-platform framework |
| **[Three.js](https://threejs.org)** | 3D Graphics library for rendering the Earth globe & lights |
| **[expo-gl](https://docs.expo.dev/versions/latest/sdk/gl-view/)** | OpenGL ES integration providing WebGL context for Three.js |
| **[Expo Router](https://docs.expo.dev/router/introduction/)** | File-based typed routing (Tabs, Stack navigation) |
| **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** | Smooth transitions and 60+ FPS UI animations |
| **[EAS Build](https://expo.dev/eas)** | Cloud-based native app packaging for Android & iOS |

---

## 📂 Project Structure

```text
3dtemp/
├── app/                        # Expo Router file-based pages
│   ├── (tabs)/
│   │   ├── _layout.jsx         # Bottom tab navigation bar
│   │   ├── index.jsx           # Main 3D Globe & Weather overview screen
│   │   └── cities.jsx          # World cities directory & search list
│   └── _layout.jsx             # Root layout & global providers
├── components/                 # Reusable UI & 3D components
│   ├── Globe.jsx               # Three.js 3D Earth, textures, shaders & markers
│   ├── WeatherCard.jsx         # Current weather conditions & stats grid
│   ├── HourlyForecast.jsx      # Horizontal 24-hour weather timeline
│   ├── WeeklyForecast.jsx      # 7-day forecast cards with temperature bars
│   └── WeatherIcon.jsx         # Custom weather condition icon renderer
├── constants/
│   └── theme.js                # Theme tokens: colors, glassmorphism, spacing, typography
├── data/
│   └── mockWeatherData.js      # Global cities data, coordinates & forecast models
├── assets/
│   ├── textures/               # High-res Earth spherical map textures
│   └── images/                 # App icons, splash screens, adaptive icons
├── app.json                    # Expo application configuration & EAS project ID
├── eas.json                    # EAS build profiles (development, preview, production)
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device (iOS / Android) or an emulator (Android Studio / Xcode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hkmrkhan/threeDtemperature.git
   cd threeDtemperature
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

### Running the App

After running `npx expo start`, you will see a QR code in your terminal:
- **Android**: Press `a` to run on an Android emulator, or scan the QR code with the Expo Go app.
- **iOS**: Press `i` to run on the iOS simulator, or scan the QR code with the Camera app (Expo Go).
- **Web**: Press `w` to open the web version in your default browser.

---

## 📱 Building with EAS (Expo Application Services)

The project is pre-configured with `eas.json` for cloud builds:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build Android APK / AAB
eas build -p android --profile preview

# Build iOS App
eas build -p ios --profile preview
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Hkmrkhan/threeDtemperature/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
