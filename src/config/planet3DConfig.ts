export interface Planet3DConfig {
  id: string;
  name: string;
  textureUrl: string;
  bumpMapUrl?: string;
  normalMapUrl?: string;
  specularMapUrl?: string;
  cloudsUrl?: string;
  color: string; // Hex fallback color
  rotationSpeed: number;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
}

export const PLANETS_3D_CONFIGS: Record<string, Planet3DConfig> = {
  earth: {
    id: 'earth',
    name: 'Earth',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    normalMapUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    specularMapUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    cloudsUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    color: '#2b82c9',
    rotationSpeed: 0.005
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg',
    bumpMapUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_topo.jpg',
    color: '#c1440e',
    rotationSpeed: 0.0048
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
    color: '#8a95a5',
    rotationSpeed: 0.001
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
    color: '#6e7a8a',
    rotationSpeed: 0.0015
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_atmosphere.jpg',
    color: '#e3bb76',
    rotationSpeed: 0.002
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
    color: '#b07f35',
    rotationSpeed: 0.012
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
    color: '#e2bf7d',
    rotationSpeed: 0.01,
    hasRings: true,
    ringInnerRadius: 1.4,
    ringOuterRadius: 2.3
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
    color: '#4b70dd',
    rotationSpeed: 0.008
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
    color: '#274687',
    rotationSpeed: 0.0085
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/pluto.jpg',
    color: '#a08b7c',
    rotationSpeed: 0.001
  }
};
