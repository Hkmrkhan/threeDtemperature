import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, PixelRatio, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, FONT_WEIGHTS, getTempColor } from '../constants/theme';

// Polyfill global document, window, & HTMLImageElement for Three.js in React Native
if (typeof global.document === 'undefined' || !global.document.createElementNS) {
  const createImg = () => ({
    style: {},
    width: 512,
    height: 512,
    addEventListener(event, handler) {
      if (event === 'load') this._onload = handler;
    },
    removeEventListener() {},
    set src(url) {
      this._src = url;
      if (this._onload) {
        setTimeout(() => this._onload(), 5);
      }
    },
    get src() {
      return this._src;
    },
  });

  global.document = {
    createElement: (type) => (type === 'img' ? createImg() : {}),
    createElementNS: (ns, type) => (type === 'img' ? createImg() : {}),
  };
}

if (typeof global.window === 'undefined') {
  global.window = global;
}

if (typeof global.HTMLImageElement === 'undefined') {
  global.HTMLImageElement = function HTMLImageElement() {};
}

// True Interactive 3D Earth Globe Engine with 3D Country Flag Markers
function WebGLGlobe({ cities, selectedCityId, onSelectCity, onError }) {
  const animFrameId = useRef(null);
  const isMounted = useRef(true);
  const rotationVelocity = useRef({ x: 0, y: 0.005 });
  const globeGroupRef = useRef(null);
  const cityMeshesRef = useRef([]);
  const cameraRef = useRef(null);
  const [flagPositions, setFlagPositions] = useState([]);
  const containerDimensions = useRef({ width: 340, height: 420 });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // PanResponder for Interactive 360 Degree Touch Dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y += gestureState.vx * 0.04;
          globeGroupRef.current.rotation.x += gestureState.vy * 0.04;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        rotationVelocity.current.y = Math.max(-0.02, Math.min(0.02, gestureState.vx * 0.02 || 0.005));
      },
    })
  ).current;

  const onLayoutContainer = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      containerDimensions.current = { width, height };
    }
  };

  const onContextCreate = async (gl) => {
    try {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }

      gl.pixelStorei = () => {};

      const width = gl.drawingBufferWidth || 300;
      const height = gl.drawingBufferHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.5);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas: {
          width,
          height,
          style: {},
          addEventListener: () => {},
          removeEventListener: () => {},
          clientHeight: height,
          clientWidth: width,
        },
        context: gl,
        antialias: true,
        alpha: true,
      });

      renderer.setPixelRatio(1);
      renderer.setSize(width, height, false);
      renderer.setViewport(0, 0, width, height);

      // Realistic 3D Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.9);
      sunLight.position.set(5, 4, 5);
      scene.add(sunLight);

      const blueRim = new THREE.DirectionalLight(0x38bdf8, 0.6);
      blueRim.position.set(-5, -2, -4);
      scene.add(blueRim);

      // Main 3D Globe Group Object
      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      globeGroup.rotation.z = THREE.MathUtils.degToRad(23.5); // Earth axial tilt

      // 1. High-Precision 3D Earth Sphere Geometry (64x64)
      const radius = 1.15;
      const globeGeo = new THREE.SphereGeometry(radius, 64, 64);
      
      // Load Equirectangular Earth Texture Asset
      let earthTexture = null;
      try {
        const earthAsset = Asset.fromModule(require('../assets/textures/earth_map.png'));
        await earthAsset.downloadAsync();
        const textureLoader = new THREE.TextureLoader();
        earthTexture = textureLoader.load(earthAsset.localUri || earthAsset.uri);
      } catch (e) {
        console.warn('Map asset loading fallback:', e);
      }

      // Procedural 3D Vertex Shading + Texture Material
      const count = globeGeo.attributes.position.count;
      const colors = new Float32Array(count * 3);
      const posAttr = globeGeo.attributes.position;

      for (let i = 0; i < count; i++) {
        const y = posAttr.getY(i);
        const normalizedY = (y / radius + 1) / 2;
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const angle = Math.atan2(z, x);
        const noise = Math.sin(angle * 4 + normalizedY * 6) * 0.5 + 0.5;

        let r, g, b;
        if (normalizedY > 0.84 || normalizedY < 0.16) {
          r = 0.92; g = 0.96; b = 1.0; // Polar ice caps
        } else if (noise > 0.52) {
          r = 0.05; g = 0.45; b = 0.18; // Rich continent green
        } else {
          r = 0.02; g = 0.14; b = 0.48; // Deep oceanic blue
        }
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
      globeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const globeMat = new THREE.MeshPhongMaterial({
        map: earthTexture || undefined,
        vertexColors: !earthTexture,
        shininess: 35,
        specular: 0x2255aa,
      });
      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      globeGroup.add(globeMesh);

      // 2. 3D Volumetric Cloud Layer
      const cloudGeo = new THREE.SphereGeometry(radius + 0.03, 48, 48);
      const cloudMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      globeGroup.add(cloudMesh);

      // 3. Volumetric Cyan Atmosphere Glow Layer
      const atmosphereGeo = new THREE.SphereGeometry(radius + 0.06, 48, 48);
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
      });
      globeGroup.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

      // 4. 3D Pin Poles + Head Markers for each Country/City
      const cityMeshArray = [];
      const pinStemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
      const markerHeadGeo = new THREE.SphereGeometry(0.038, 16, 16);

      cities.forEach((city) => {
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lng + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        const surfacePoint = new THREE.Vector3(x, y, z);
        const normal = surfacePoint.clone().normalize();

        // Pin Stem extending outward from Earth surface
        const temp = city.current.temp;
        let colorHex = 0x26c6da;
        if (temp < 0) colorHex = 0x4fc3f7;
        else if (temp < 10) colorHex = 0x29b6f6;
        else if (temp < 18) colorHex = 0x26c6da;
        else if (temp < 25) colorHex = 0x66bb6a;
        else if (temp < 32) colorHex = 0xffa726;
        else colorHex = 0xef5350;

        const pinMat = new THREE.MeshPhongMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.5,
        });

        const pinMesh = new THREE.Mesh(pinStemGeo, pinMat);
        pinMesh.position.copy(surfacePoint.clone().add(normal.clone().multiplyScalar(0.06)));
        pinMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        globeGroup.add(pinMesh);

        // Head marker sphere
        const headMesh = new THREE.Mesh(markerHeadGeo, pinMat);
        headMesh.position.copy(surfacePoint.clone().add(normal.clone().multiplyScalar(0.12)));
        globeGroup.add(headMesh);

        cityMeshArray.push({
          id: city.id,
          city,
          mesh: headMesh,
        });
      });
      cityMeshesRef.current = cityMeshArray;

      scene.add(globeGroup);

      // Render Loop & Real-Time 3D Projection of Country Flags (~45 FPS)
      let lastTime = Date.now();
      let lastProjectionTime = 0;
      const frameInterval = 1000 / 45;

      const render = () => {
        if (!isMounted.current) return;
        animFrameId.current = requestAnimationFrame(render);

        const now = Date.now();
        const delta = now - lastTime;

        if (delta > frameInterval) {
          lastTime = now - (delta % frameInterval);
          globeGroup.rotation.y += rotationVelocity.current.y;
          cloudMesh.rotation.y += 0.001;
          renderer.render(scene, camera);
          gl.endFrameEXP();

          // Calculate 3D projected screen positions for Country Flag Pins (throttled to ~20fps for performance)
          if (now - lastProjectionTime > 50) {
            lastProjectionTime = now;
            const updatedPositions = [];
            const cWidth = containerDimensions.current.width;
            const cHeight = containerDimensions.current.height;
            const camPos = camera.position;

            cityMeshArray.forEach(({ id, city, mesh }) => {
              const worldPos = new THREE.Vector3();
              mesh.getWorldPosition(worldPos);

              // Check if flag is on the front side of the 3D Globe facing camera
              const dirToCam = camPos.clone().sub(worldPos);
              const isFront = dirToCam.dot(worldPos.clone().normalize()) > -0.2;

              if (isFront) {
                const projected = worldPos.clone().project(camera);
                const screenX = (projected.x * 0.5 + 0.5) * cWidth;
                const screenY = (-projected.y * 0.5 + 0.5) * cHeight;

                updatedPositions.push({
                  id,
                  city,
                  screenX,
                  screenY,
                  isFront: true,
                });
              }
            });
            setFlagPositions(updatedPositions);
          }
        }
      };
      render();
    } catch (err) {
      console.warn('WebGL 3D flag setup error:', err);
      if (onError) onError(err);
    }
  };

  return (
    <View
      style={styles.glContainer}
      onLayout={onLayoutContainer}
      {...panResponder.panHandlers}
    >
      <GLView style={styles.glView} onContextCreate={onContextCreate} />

      {/* Floating 3D Country Flag Badges projected directly over Globe surface */}
      {flagPositions.map(({ id, city, screenX, screenY }) => {
        const isSelected = selectedCityId === id;
        const tempColor = getTempColor(city.current.temp);

        return (
          <TouchableOpacity
            key={id}
            style={[
              styles.flagPinBadge,
              {
                left: screenX - 35,
                top: screenY - 22,
                borderColor: isSelected ? COLORS.accentCyan : 'rgba(255, 255, 255, 0.25)',
                backgroundColor: isSelected ? 'rgba(0, 212, 255, 0.25)' : 'rgba(15, 23, 42, 0.85)',
              },
            ]}
            onPress={() => onSelectCity(id)}
            activeOpacity={0.8}
          >
            <Text style={styles.flagEmoji}>{city.flag}</Text>
            <Text style={[styles.flagTempText, { color: tempColor }]}>
              {city.current.temp}°
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Globe({ cities, selectedCityId, onSelectCity }) {
  const [webGLError, setWebGLError] = useState(false);

  return (
    <View style={styles.container}>
      <WebGLGlobe
        cities={cities}
        selectedCityId={selectedCityId}
        onSelectCity={onSelectCity}
        onError={() => setWebGLError(true)}
      />

      {/* Bottom Horizontal City Selector Pills */}
      <View style={styles.cityPickerOverlay}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityPickerScroll}
        >
          {cities.map((city) => {
            const isSelected = selectedCityId === city.id;
            return (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityPill,
                  isSelected && styles.cityPillSelected,
                ]}
                onPress={() => onSelectCity(city.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cityPillText, isSelected && styles.cityPillTextSelected]}>
                  {city.flag} {city.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B1A',
    position: 'relative',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  glContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  glView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flagPinBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  flagTempText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cityPickerOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  cityPickerScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  cityPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
  },
  cityPillSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.25)',
    borderColor: COLORS.accentCyan,
  },
  cityPillText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textSecondary,
  },
  cityPillTextSelected: {
    color: COLORS.accentCyan,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
