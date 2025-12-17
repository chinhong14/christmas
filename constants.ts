
import * as THREE from 'three';

/**
 * ==========================================
 * CONFIGURATION & COLORS
 * ==========================================
 */
export const COLORS = {
  primary: '#10B981',   // Emerald 500
  secondary: '#065F46', // Emerald 800
  accent: '#F59E0B',    // Amber 500
  gold: '#FFD700',
  warmRed: '#EF4444',
  highlight: '#FEF3C7', // Amber 100
};

export const PARTICLE_COUNT = 800;
export const TREE_HEIGHT = 14;
export const TREE_RADIUS = 5;
export const SCATTER_RADIUS = 25;

export const PALETTE = [
  new THREE.Color('#059669'), // Emerald 600
  new THREE.Color('#047857'), // Emerald 700
  new THREE.Color('#10B981'), // Emerald 500
  new THREE.Color('#FBBF24'), // Amber 400 (Goldish)
  new THREE.Color('#DC2626'), // Red 600
  new THREE.Color('#D97706'), // Amber 600 (Dark Gold)
];

/**
 * ==========================================
 * MEMORY LANE DATA
 * ==========================================
 * Source: https://github.com/chinhong14/christmas
 * Path: /assets/*.jpeg
 * ==========================================
 */

// We use the raw link pattern for the assets folder
const BASE_URL = "https://raw.githubusercontent.com/chinhong14/christmas/main/assets/";

export const MEMORY_LANE = [
  { 
    id: 1, 
    text: "It started simple. Then we found our people", 
    img: `${BASE_URL}1.jpeg` 
  },
  { 
    id: 2, 
    text: "A few faces grew into our own noisy tribe", 
    img: `${BASE_URL}2.jpeg` 
  },
  { 
    id: 3, 
    text: "We just got each other, from day one", 
    img: `${BASE_URL}3.jpeg`
  },
  { 
    id: 4, 
    text: "No filters, no pretending. Just us being us", 
    img: `${BASE_URL}4.jpeg`
  },
  { 
    id: 5, 
    text: "We’ve seen every side of every story", 
    img: `${BASE_URL}5.jpeg`
  },
  { 
    id: 6, 
    text: "Laughter was the only medicine we ever needed", 
    img: `${BASE_URL}6.jpeg`
  },
  { 
    id: 7, 
    text: "Every crazy moment, locked down forever", 
    img: `${BASE_URL}7.jpeg`
  },
  { 
    id: 8, 
    text: "When things got tough, we were the unbreakable shield", 
    img: `${BASE_URL}8.jpeg`
  },
  { 
    id: 9, 
    text: "Time kept moving, but this feeling just stayed", 
    img: `${BASE_URL}9.jpeg`
  },
  { 
    id: 10, 
    text: "We still have a short journey before we all graduate...", 
    img: `${BASE_URL}10.jpeg`
  },
  { 
    id: 11, 
    text: "But we're making sure to grab every memory we can", 
    img: `${BASE_URL}11.jpeg`
  },
  { 
    id: 12, 
    text: "Just hit capture—this is the good stuff", 
    img: `${BASE_URL}12.jpeg`
  },
  { 
    id: 13, 
    text: "The best moments always happen with zero planning", 
    img: `${BASE_URL}13.jpeg`
  },
  { 
    id: 14, 
    text: "The journey meant nothing without this crew beside it", 
    img: `${BASE_URL}14.jpeg`
  },
  { 
    id: 15, 
    text: "But before that, let’s wrap up our year with a bang!", 
    img: `${BASE_URL}15.jpeg`
  },
];
