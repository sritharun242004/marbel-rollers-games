import { create } from 'zustand';
import type { GameState, GameScene, MarbleState, PathPoint } from '../utils/types';
import { LEVELS } from '../data/levels';
import { AUDIO_CONFIG } from '../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

interface GameStore extends GameState {
  // Current scene
  currentScene: GameScene;
  
  // Student info
  studentName: string;
  
  // Actions
  setScene: (scene: GameScene) => void;
  setStudentName: (name: string) => void;
  startLevel: (levelNumber: number) => void;
  completeLevel: (starsCollected: number) => void;
  resetLevel: () => void;
  setDrawnPath: (path: PathPoint[]) => void;
  updateMarble: (marble: MarbleState) => void;
  collectStar: (starId: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  setDrawing: (isDrawing: boolean) => void;
  updateTime: (deltaTime: number) => void;
  setMusicVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  toggleTutorial: () => void;
  toggleHaptic: () => void;
  resetProgress: () => void;
  loadProgress: () => void;
  saveProgress: () => void;
}

const initialMarbleState: MarbleState = {
  position: { x: 0, y: 0 },
  velocity: 0,
  KE: 0,
  isRolling: false,
  isAirborne: false,
  rotation: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentScene: 'splash',
  studentName: '',
  currentLevel: 1,
  levelsCompleted: [],
  starsEarned: 0,
  totalEnergyPoints: 0,
  levelData: null,
  drawnPath: [],
  marble: initialMarbleState,
  starsCollected: [],
  timeElapsed: 0,
  isPlaying: false,
  isPaused: false,
  isDrawing: false,
  musicVolume: AUDIO_CONFIG.MUSIC_VOLUME,
  sfxVolume: AUDIO_CONFIG.SFX_VOLUME,
  tutorialEnabled: true,
  hapticEnabled: true,

  // Actions
  setScene: (scene) => set({ currentScene: scene }),
  
  setStudentName: (name) => {
    set({ studentName: name });
    saveToLocalStorage('student-name', name);
  },

  startLevel: (levelNumber) => {
    const levelData = LEVELS.find(l => l.levelNumber === levelNumber);
    if (!levelData) return;

    set({
      currentLevel: levelNumber,
      levelData,
      currentScene: 'gameplay',
      drawnPath: [],
      marble: {
        ...initialMarbleState,
        position: { ...levelData.startPosition },
      },
      starsCollected: [],
      timeElapsed: 0,
      isPlaying: false,
      isPaused: false,
    });
  },

  completeLevel: (starsCollected) => {
    const { currentLevel, levelsCompleted, starsEarned, levelData } = get();
    
    console.log('🏁 Level Complete!', {
      level: currentLevel,
      starsCollected,
      requiredStars: levelData?.requiredStars,
      previouslyCompleted: levelsCompleted.includes(currentLevel),
      currentLevelsCompleted: levelsCompleted
    });
    
    // ALWAYS complete the level if player reaches finish - stars are optional bonus!
    // Check if level requirements are met (more forgiving - only need to reach finish)
    const meetsRequirements = true; // Changed: reaching finish is enough!
    
    if (!meetsRequirements) {
      console.log('❌ Not enough stars to complete level');
      return;
    }
    
    // Add to completed levels if not already there
    const newCompleted = levelsCompleted.includes(currentLevel)
      ? levelsCompleted
      : [...levelsCompleted, currentLevel];
    
    console.log('✅ Level requirements met! Updating progress...', {
      newCompleted,
      newStarsEarned: starsEarned + starsCollected,
      willUnlockLevel: currentLevel + 1
    });
    
    set({
      levelsCompleted: newCompleted,
      starsEarned: starsEarned + starsCollected,
      totalEnergyPoints: get().totalEnergyPoints + (starsCollected * 100),
      currentScene: 'results',
    });
    
    // Save progress immediately
    console.log('💾 Saving progress...');
    get().saveProgress();
    
    // Verify save
    const saved = get().levelsCompleted;
    console.log('✓ Progress saved! Levels completed:', saved);
  },

  resetLevel: () => {
    const { levelData } = get();
    if (!levelData) return;

    set({
      drawnPath: [],
      marble: {
        ...initialMarbleState,
        position: { ...levelData.startPosition },
      },
      starsCollected: [],
      timeElapsed: 0,
      isPlaying: false,
      isPaused: false,
    });
  },

  setDrawnPath: (path) => set({ drawnPath: path }),

  updateMarble: (marble) => set({ marble }),

  collectStar: (starId) => {
    const { starsCollected } = get();
    console.log('🌟 collectStar called:', { starId, currentStars: starsCollected });
    if (!starsCollected.includes(starId)) {
      const newStars = [...starsCollected, starId];
      set({ starsCollected: newStars });
      console.log('✨ Star added! New stars:', newStars);
    } else {
      console.log('⚠️ Star already collected:', starId);
    }
  },

  setPlaying: (isPlaying) => set({ isPlaying }),

  setPaused: (isPaused) => set({ isPaused }),

  setDrawing: (isDrawing) => set({ isDrawing }),

  updateTime: (deltaTime) => {
    if (get().isPlaying && !get().isPaused) {
      set({ timeElapsed: get().timeElapsed + deltaTime });
    }
  },

  setMusicVolume: (volume) => {
    set({ musicVolume: volume });
    get().saveProgress();
  },

  setSFXVolume: (volume) => {
    set({ sfxVolume: volume });
    get().saveProgress();
  },

  toggleTutorial: () => {
    set({ tutorialEnabled: !get().tutorialEnabled });
    get().saveProgress();
  },

  toggleHaptic: () => {
    set({ hapticEnabled: !get().hapticEnabled });
    get().saveProgress();
  },

  resetProgress: () => {
    set({
      currentLevel: 1,
      levelsCompleted: [],
      starsEarned: 0,
      totalEnergyPoints: 0,
    });
    localStorage.removeItem('marble-race-progress');
  },

  loadProgress: () => {
    const saved = loadFromLocalStorage<any>('marble-race-progress', null);
    const savedName = loadFromLocalStorage<string>('student-name', '');
    
    if (saved) {
      set({
        studentName: savedName,
        levelsCompleted: saved.levelsCompleted || [],
        starsEarned: saved.starsEarned || 0,
        totalEnergyPoints: saved.totalEnergyPoints || 0,
        musicVolume: saved.musicVolume ?? AUDIO_CONFIG.MUSIC_VOLUME,
        sfxVolume: saved.sfxVolume ?? AUDIO_CONFIG.SFX_VOLUME,
        tutorialEnabled: saved.tutorialEnabled ?? true,
        hapticEnabled: saved.hapticEnabled ?? true,
      });
    } else if (savedName) {
      set({ studentName: savedName });
    }
  },

  saveProgress: () => {
    const { levelsCompleted, starsEarned, totalEnergyPoints, musicVolume, sfxVolume, tutorialEnabled, hapticEnabled } = get();
    saveToLocalStorage('marble-race-progress', {
      levelsCompleted,
      starsEarned,
      totalEnergyPoints,
      musicVolume,
      sfxVolume,
      tutorialEnabled,
      hapticEnabled,
    });
  },
}));

