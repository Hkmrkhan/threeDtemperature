import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Stars background
function Stars() {
  const starsRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1500}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// Atmosphere glow ring
function Atmosphere({ radius }) {
  return (
    <mesh>
      <sphereGeometry args={[radius + 0.05, 64, 64]} />
      <meshBasicMaterial
        color="#00D4FF"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// City marker on the globe
function CityMarker({ city, radius, isSelected, onSelect }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const position = useMemo(
    () => latLngToVector3(city.lat, city.lng, radius),
    [city.lat, city.lng, radius]
  );

  // Color based on temperature
  const color = useMemo(() => {
    const temp = city.current.temp;
    if (temp < 0) return '#4FC3F7';
    if (temp < 10) return '#29B6F6';
    if (temp < 18) return '#26C6DA';
    if (temp < 24) return '#66BB6A';
    if (temp < 32) return '#FFA726';
    if (temp < 40) return '#EF5350';
    return '#D32F2F';
  }, [city.current.temp]);

  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + city.lat) * 0.3;
      glowRef.current.scale.setScalar(isSelected ? scale * 1.8 : scale);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef} onClick={() => onSelect(city.id)}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.5 : 0.25} />
      </mesh>
      {/* Inner dot */}
      <mesh ref={meshRef} onClick={() => onSelect(city.id)}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// The Earth globe
function EarthSphere({ cities, selectedCityId, onSelectCity }) {
  const globeRef = useRef();
  const radius = 1.5;

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
    }
  });

  // Create a simple gradient sphere using vertex colors
  const globeGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(radius, 64, 64);
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const position = geo.attributes.position;

    for (let i = 0; i < count; i++) {
      const y = position.getY(i);
      const normalizedY = (y / radius + 1) / 2; // 0 to 1

      // Create a stylized Earth color scheme
      // Poles are white/icy, middle latitudes green, equator warm, oceans deep blue
      const x = position.getX(i);
      const z = position.getZ(i);
      const angle = Math.atan2(z, x);
      const noise = Math.sin(angle * 3 + normalizedY * 5) * 0.5 + 0.5;

      let r, g, b;

      if (normalizedY > 0.85 || normalizedY < 0.15) {
        // Ice caps
        r = 0.85 + noise * 0.1;
        g = 0.9 + noise * 0.05;
        b = 0.95;
      } else if (noise > 0.55) {
        // Land - green tones
        r = 0.05 + noise * 0.1;
        g = 0.25 + noise * 0.2;
        b = 0.08 + noise * 0.05;
      } else {
        // Ocean - deep blue
        r = 0.02 + noise * 0.03;
        g = 0.08 + noise * 0.1;
        b = 0.28 + noise * 0.15;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <group ref={globeRef}>
      {/* Earth sphere */}
      <mesh geometry={globeGeometry}>
        <meshStandardMaterial vertexColors side={THREE.FrontSide} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Atmosphere */}
      <Atmosphere radius={radius} />

      {/* Second atmosphere layer */}
      <mesh>
        <sphereGeometry args={[radius + 0.12, 64, 64]} />
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* City markers */}
      {cities.map((city) => (
        <CityMarker
          key={city.id}
          city={city}
          radius={radius}
          isSelected={selectedCityId === city.id}
          onSelect={onSelectCity}
        />
      ))}
    </group>
  );
}

// Camera controller for auto-rotation feel
function CameraSetup() {
  const { camera } = useThree();

  useMemo(() => {
    camera.position.set(0, 0.5, 4);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

export default function Globe({ cities, selectedCityId, onSelectCity }) {
  return (
    <View style={styles.container}>
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        style={styles.canvas}
      >
        <CameraSetup />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4FC3F7" />
        <pointLight position={[0, 0, 0]} intensity={0.2} color="#00D4FF" />
        <Stars />
        <EarthSphere
          cities={cities}
          selectedCityId={selectedCityId}
          onSelectCity={onSelectCity}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  canvas: {
    flex: 1,
  },
});
