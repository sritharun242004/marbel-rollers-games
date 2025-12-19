import type { LevelData } from '../utils/types';

export const LEVELS: LevelData[] = [
  // LEVEL 1: First Descent (Tutorial)
  {
    levelNumber: 1,
    levelName: "First Journey Down",
    description: "Roll your marble from the mountain peak to the ground!",
    tutorial: true,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [],
    stars: [],
    requiredStars: 0,
    parTime: 10,
    tutorialSteps: [
      {
        step: 1,
        message: "Welcome to Marble Roller Race! 🎯 Your marble starts at the mountain peak!",
        highlightElement: "speedybot",
        action: "none"
      },
      {
        step: 2,
        message: "Draw a path from PEAK ⛰️ to GROUND 🏁 with your finger!",
        highlightElement: "canvas",
        action: "draw",
        hint: "dotted-line"
      },
      {
        step: 3,
        message: "Great! Now tap GO to roll your marble down!",
        highlightElement: "go-button",
        action: "tap-go"
      },
      {
        step: 4,
        message: "See how the marble speeds up rolling downhill? That's Kinetic Energy - energy of MOTION!",
        highlightElement: "marble",
        action: "watch",
        pauseAtFrame: 60
      },
      {
        step: 5,
        message: "The color shows speed. Faster = More KE = Reaches ground quicker!",
        highlightElement: "speed-meter",
        action: "observe"
      }
    ]
  },

  // LEVEL 2: Speed Zones
  {
    levelNumber: 2,
    levelName: "Faster Route Down",
    description: "Collect energy stars on the way down!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [],
    stars: [
      { id: 1, position: { x: 250, y: 200 }, requiredSpeed: 15, tolerance: 5, collected: false },
      { id: 2, position: { x: 450, y: 350 }, requiredSpeed: 30, tolerance: 5, collected: false },
      { id: 3, position: { x: 650, y: 480 }, requiredSpeed: 45, tolerance: 5, collected: false }
    ],
    requiredStars: 3,
    parTime: 8
  },

  // LEVEL 3: The Jump
  {
    levelNumber: 3,
    levelName: "Jump Over the Gap",
    description: "Make your marble jump over obstacles!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [
      {
        type: "gap",
        position: { x: 400, y: 400 },
        size: { x: 150, y: 100 },
        properties: { minSpeedToClear: 40 }
      }
    ],
    stars: [],
    requiredStars: 0,
    parTime: 6
  },

  // LEVEL 4: Multiple Jumps
  {
    levelNumber: 4,
    levelName: "The Shortcut Path",
    description: "Two gaps! Take the shortcut down the mountain!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [
      {
        type: "gap",
        position: { x: 300, y: 300 },
        size: { x: 100, y: 80 },
        properties: { minSpeedToClear: 35 }
      },
      {
        type: "gap",
        position: { x: 550, y: 450 },
        size: { x: 100, y: 80 },
        properties: { minSpeedToClear: 35 }
      }
    ],
    stars: [
      { id: 1, position: { x: 400, y: 250 }, requiredSpeed: 40, tolerance: 5, collected: false }
    ],
    requiredStars: 0,
    parTime: 8
  },

  // LEVEL 5: The Loop
  {
    levelNumber: 5,
    levelName: "The Mountain Loop",
    description: "A fun loop down the mountain! Need lots of speed!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 650, y: 500 },
    obstacles: [],
    stars: [
      { id: 1, position: { x: 400, y: 250 }, requiredSpeed: 50, tolerance: 5, collected: false },
      { id: 2, position: { x: 500, y: 350 }, requiredSpeed: 45, tolerance: 5, collected: false }
    ],
    requiredStars: 1,
    parTime: 7
  },

  // LEVEL 6: Precision Challenge
  {
    levelNumber: 6,
    levelName: "Precision Descent",
    description: "Roll at exact speeds through checkpoints!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [],
    stars: [
      { id: 1, position: { x: 200, y: 150 }, requiredSpeed: 20, tolerance: 3, collected: false },
      { id: 2, position: { x: 350, y: 250 }, requiredSpeed: 35, tolerance: 3, collected: false },
      { id: 3, position: { x: 500, y: 350 }, requiredSpeed: 50, tolerance: 3, collected: false },
      { id: 4, position: { x: 650, y: 480 }, requiredSpeed: 40, tolerance: 3, collected: false }
    ],
    requiredStars: 3,
    parTime: 10
  },

  // LEVEL 7: Energy Budget
  {
    levelNumber: 7,
    levelName: "The Efficient Route",
    description: "Find the smartest path down with less space!",
    tutorial: false,
    startPosition: { x: 100, y: 200 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [
      {
        type: "wall",
        position: { x: 300, y: 300 },
        size: { x: 200, y: 20 }
      }
    ],
    stars: [
      { id: 1, position: { x: 400, y: 250 }, requiredSpeed: 30, tolerance: 5, collected: false },
      { id: 2, position: { x: 600, y: 450 }, requiredSpeed: 35, tolerance: 5, collected: false }
    ],
    requiredStars: 1,
    parTime: 8
  },

  // LEVEL 8: Uphill Battle
  {
    levelNumber: 8,
    levelName: "The Mountain Climb",
    description: "Sometimes you climb up before rolling down!",
    tutorial: false,
    startPosition: { x: 100, y: 400 },
    finishPosition: { x: 700, y: 100 },
    obstacles: [],
    stars: [
      { id: 1, position: { x: 300, y: 300 }, requiredSpeed: 25, tolerance: 5, collected: false },
      { id: 2, position: { x: 500, y: 200 }, requiredSpeed: 20, tolerance: 5, collected: false }
    ],
    requiredStars: 1,
    parTime: 12
  },

  // LEVEL 9: Obstacle Course
  {
    levelNumber: 9,
    levelName: "Mountain Adventure",
    description: "Your biggest challenge yet!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [
      {
        type: "gap",
        position: { x: 300, y: 250 },
        size: { x: 120, y: 80 },
        properties: { minSpeedToClear: 40 }
      },
      {
        type: "wall",
        position: { x: 500, y: 350 },
        size: { x: 100, y: 20 }
      }
    ],
    stars: [
      { id: 1, position: { x: 250, y: 200 }, requiredSpeed: 35, tolerance: 5, collected: false },
      { id: 2, position: { x: 450, y: 300 }, requiredSpeed: 45, tolerance: 5, collected: false },
      { id: 3, position: { x: 650, y: 480 }, requiredSpeed: 40, tolerance: 5, collected: false }
    ],
    requiredStars: 2,
    parTime: 10
  },

  // LEVEL 10: Final Boss
  {
    levelNumber: 10,
    levelName: "Master of the Mountain",
    description: "The ultimate marble race! Show what you've learned!",
    tutorial: false,
    startPosition: { x: 100, y: 100 },
    finishPosition: { x: 700, y: 500 },
    obstacles: [
      {
        type: "gap",
        position: { x: 250, y: 200 },
        size: { x: 100, y: 80 },
        properties: { minSpeedToClear: 38 }
      },
      {
        type: "wall",
        position: { x: 400, y: 300 },
        size: { x: 150, y: 15 }
      },
      {
        type: "gap",
        position: { x: 600, y: 450 },
        size: { x: 120, y: 80 },
        properties: { minSpeedToClear: 42 }
      }
    ],
    stars: [
      { id: 1, position: { x: 200, y: 150 }, requiredSpeed: 35, tolerance: 4, collected: false },
      { id: 2, position: { x: 350, y: 250 }, requiredSpeed: 40, tolerance: 4, collected: false },
      { id: 3, position: { x: 500, y: 350 }, requiredSpeed: 50, tolerance: 4, collected: false },
      { id: 4, position: { x: 650, y: 480 }, requiredSpeed: 45, tolerance: 4, collected: false }
    ],
    requiredStars: 3,
    parTime: 15
  }
];

