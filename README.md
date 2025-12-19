# 🎢 Marble Race - Speed Master

An educational game that teaches **Kinetic Energy** concepts to kids aged 10-12 through interactive marble racing!

## 🎯 Game Overview

**Marble Race - Speed Master** is a fun, story-driven educational game where students learn about Kinetic Energy by drawing ramps and watching marbles race down them. The game features 10 progressively challenging levels that teach the relationship between speed, height, and kinetic energy.

## 🎓 Educational Goals

After playing, students will understand:
- ✅ Kinetic Energy = Energy of Motion
- ✅ The formula: KE = ½ × mass × speed²
- ✅ How height affects speed
- ✅ The relationship between speed and energy
- ✅ Practical applications of energy concepts

## 🎮 Features

### Core Gameplay
- **10 Unique Levels**: From basic tutorials to complex challenges
- **Interactive Drawing**: Draw ramps with your finger or mouse
- **Real-time Physics**: Watch marbles roll with accurate physics simulation
- **Visual Learning**: See KE through color-coded marble glows
- **Star Collecting**: Hit specific speeds to collect stars
- **Progressive Difficulty**: Each level introduces new concepts

### Technical Features
- **Mobile-First Design**: Works perfectly on phones, tablets, and desktops
- **Responsive UI**: Adapts to all screen sizes
- **Smooth Animations**: 60 FPS gameplay with Framer Motion
- **Progress Saving**: Automatically saves your progress
- **Celebration Effects**: Confetti and animations for achievements
- **Touch Optimized**: Perfect for touchscreen devices

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd marble-race-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe code
- **Vite**: Fast build tool
- **Framer Motion**: Smooth animations
- **Zustand**: State management
- **Canvas API**: Drawing and rendering
- **Canvas Confetti**: Celebration effects

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Game Structure

```
src/
├── components/         # Reusable UI components
│   ├── Marble.tsx     # Animated marble component
│   ├── DrawingCanvas.tsx  # Interactive drawing system
│   └── UI/            # HUD components
├── scenes/            # Game scenes
│   ├── MainMenu.tsx
│   ├── LevelSelect.tsx
│   ├── Gameplay.tsx
│   └── Results.tsx
├── engine/            # Physics engine
│   └── PhysicsEngine.ts
├── data/              # Level definitions
│   └── levels.ts
├── stores/            # State management
│   └── gameStore.ts
└── utils/             # Helper functions
    ├── constants.ts
    ├── types.ts
    └── helpers.ts
```

## 🎯 Level Progression

1. **First Roll** (Tutorial) - Learn the basics
2. **Speed Zones** - Hit different speeds
3. **The Jump** - Build enough KE to jump gaps
4. **Double Trouble** - Multiple jumps
5. **Loop-de-Loop** - High KE challenges
6. **Speed Gates** - Precision control
7. **Limited Lines** - Resource management
8. **Uphill Challenge** - Energy transformation
9. **Obstacle Master** - Combined challenges
10. **Speed Master Challenge** - Final test

## 🎨 Visual Design

### Color Scheme
- **Primary**: Royal Blue (#4169E1)
- **Secondary**: Orange (#FFA500)
- **Success**: Green (#00FF00)
- **Background**: Light Blue (#F0F8FF)

### KE Color Indicators
- **Gray (#CCCCCC)**: No KE (0 mph)
- **Sky Blue (#87CEEB)**: Low KE (0-20 mph)
- **Light Green (#90EE90)**: Medium KE (20-40 mph)
- **Gold (#FFD700)**: High KE (40-60 mph)
- **Red-Orange (#FF4500)**: Ultra KE (60+ mph)

## 📊 Performance

- **Target**: 60 FPS gameplay
- **Canvas Size**: 800x600 (scales responsively)
- **Physics Updates**: 60 times per second
- **Optimized Rendering**: RequestAnimationFrame loop

## 🎓 Educational Standards Alignment

This game aligns with science education standards for grades 5-7:
- Understanding energy and motion
- Recognizing kinetic vs. potential energy
- Understanding energy transformation
- Mathematical relationships in physics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is created for educational purposes.

## 👥 Credits

- Game Design: Educational physics concepts
- Development: React + TypeScript
- Animations: Framer Motion
- Physics: Custom engine

## 🎮 How to Play

1. **Select a Level**: Choose from 10 exciting levels
2. **Draw Your Ramp**: Use your finger or mouse to draw a path from START to FINISH
3. **Watch Marble Roll**: Tap GO and watch physics in action!
4. **Collect Stars**: Hit specific speeds to collect all stars
5. **Learn KE**: Observe how speed creates kinetic energy
6. **Complete Levels**: Unlock new challenges and master energy concepts!

## 🌟 Key Features for Educators

- **Self-Paced Learning**: Students progress at their own speed
- **Immediate Feedback**: Visual and numerical feedback on performance
- **Gamified Education**: Makes physics fun and engaging
- **Progress Tracking**: See which levels students have completed
- **Replayability**: Practice makes perfect!

## 📱 Mobile Optimization

- Touch-friendly controls (minimum 44px touch targets)
- Optimized for portrait and landscape modes
- No pinch-to-zoom interference
- Smooth animations on lower-end devices
- Minimal data usage

## 🎯 Success Metrics

Students succeed when they:
- ✅ Complete all 10 levels
- ✅ Can explain KE = energy of motion
- ✅ Understand speed increases KE
- ✅ Recognize the KE formula
- ✅ Apply concepts to solve challenges

---

**Made with ❤️ for young scientists learning about energy!**
