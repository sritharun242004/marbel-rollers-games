// Game Constants
export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  FPS: 60,
  MARBLE_RADIUS: 15,
  MARBLE_MASS: 35, // kg (heavy marble for realistic physics)
  GRAVITY: 25, // m/s² (increased for faster, more exciting gameplay!)
  FRICTION: 0.99, // reduced friction for faster rolling
  MIN_DRAW_LENGTH: 100,
  MAX_DRAW_LENGTH: 2000,
  STAR_COLLECT_DISTANCE: 30,
} as const;

// Color Palette
export const COLORS = {
  // Background
  BACKGROUND: '#F0F8FF',
  GROUND: '#8B4513',
  RAMP: '#FFA500',
  RAMP_DRAWING: 'rgba(255, 165, 0, 0.5)',
  RAMP_INVALID: '#FF0000',
  
  // Energy Colors
  NO_KE: '#CCCCCC',
  LOW_KE: '#87CEEB',      // 0-20 mph
  MEDIUM_KE: '#90EE90',    // 20-40 mph
  HIGH_KE: '#FFD700',      // 40-60 mph
  ULTRA_KE: '#FF4500',     // 60+ mph
  
  // UI Colors
  SUCCESS: '#00FF00',
  WARNING: '#FFFF00',
  DANGER: '#FF0000',
  PRIMARY: '#4169E1',
  SECONDARY: '#FFA500',
} as const;

// Speed thresholds for color changes
export const SPEED_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 40,
  ULTRA: 60,
} as const;

// Animation durations (ms)
export const ANIMATION = {
  STAR_COLLECT: 500,
  CONFETTI: 3000,
  FADE_IN: 500,
  FADE_OUT: 500,
  CELEBRATION: 4000,
} as const;

// Audio config
export const AUDIO_CONFIG = {
  MUSIC_VOLUME: 0.6,
  SFX_VOLUME: 0.8,
} as const;
