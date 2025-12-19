// Core Types
export interface Vector2D {
  x: number;
  y: number;
}

export interface PathPoint extends Vector2D {
  timestamp: number;
}

export interface PathSegment {
  start: Vector2D;
  end: Vector2D;
  angle: number;
  length: number;
}

export interface Star {
  id: number;
  position: Vector2D;
  requiredSpeed: number;
  tolerance: number;
  collected: boolean;
}

export type ObstacleType = 'gap' | 'wall' | 'moving' | 'spinner';

export interface Obstacle {
  type: ObstacleType;
  position: Vector2D;
  size: Vector2D;
  properties?: any;
}

export interface TutorialStep {
  step: number;
  message: string;
  highlightElement: string;
  action: 'none' | 'draw' | 'tap-go' | 'watch' | 'observe';
  hint?: string;
  pauseAtFrame?: number;
}

export interface LevelData {
  levelNumber: number;
  levelName: string;
  description: string;
  tutorial: boolean;
  startPosition: Vector2D;
  finishPosition: Vector2D;
  obstacles: Obstacle[];
  stars: Star[];
  requiredStars: number;
  parTime: number;
  tutorialSteps?: TutorialStep[];
}

export interface MarbleState {
  position: Vector2D;
  velocity: number;
  KE: number;
  isRolling: boolean;
  isAirborne: boolean;
  rotation: number;
}

export interface GameState {
  // Progress
  currentLevel: number;
  levelsCompleted: number[];
  starsEarned: number;
  totalEnergyPoints: number;
  
  // Current level
  levelData: LevelData | null;
  drawnPath: PathPoint[];
  marble: MarbleState;
  starsCollected: number[];
  timeElapsed: number;
  
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isDrawing: boolean;
  
  // Settings
  musicVolume: number;
  sfxVolume: number;
  tutorialEnabled: boolean;
  hapticEnabled: boolean;
}

export interface PerformanceData {
  starsCollected: number;
  finalSpeed: number;
  totalKE: number;
  timeElapsed: number;
  parTime: number;
}

export type GameScene = 
  | 'splash' 
  | 'menu' 
  | 'tutorial' 
  | 'levelSelect' 
  | 'gameplay' 
  | 'results'
  | 'completion';
