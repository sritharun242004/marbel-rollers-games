import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import './MainMenu.css';

export const MainMenu: React.FC = () => {
  const { setScene, levelsCompleted, starsEarned, studentName } = useGameStore();

  return (
    <div className="main-menu">
      <div className="menu-container">
        {/* Title with animation */}
        <motion.div
          className="game-title"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h1 className="title-text">
            <span className="title-emoji">⛰️</span>
            MARBLE ROLLER RACE
            <span className="title-emoji">🏁</span>
          </h1>
          <p className="subtitle">Peak to Ground Challenge</p>
        </motion.div>

        {/* Floating marble animation */}
        <motion.div
          className="floating-marble"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div style={{ fontSize: '60px' }}>🎱💨</div>
        </motion.div>

        {/* Menu buttons */}
        <motion.div
          className="menu-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="menu-btn play-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScene('levelSelect')}
          >
            🎮 PLAY
          </motion.button>

          <motion.button
            className="menu-btn tutorial-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              useGameStore.getState().startLevel(1);
            }}
          >
            📚 TUTORIAL
          </motion.button>

          <motion.button
            className="menu-btn about-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ℹ️ ABOUT
          </motion.button>
        </motion.div>

        {/* Progress summary */}
        {levelsCompleted.length > 0 && (
          <motion.div
            className="progress-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="progress-item">
              <span className="progress-icon">🏆</span>
              <span>Levels: {levelsCompleted.length}/10</span>
            </div>
            <div className="progress-item">
              <span className="progress-icon">⭐</span>
              <span>Stars: {starsEarned}/30</span>
            </div>
          </motion.div>
        )}

        {/* Student Welcome */}
        {studentName && (
          <motion.div
            className="student-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <p className="welcome-message">
              👋 Welcome back, <strong>{studentName}</strong>!
            </p>
          </motion.div>
        )}

        {/* Educational tagline */}
        <motion.div
          className="tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p>🎓 Race marbles from mountain peak to ground using Kinetic Energy!</p>
          <p className="age-tag">Learn physics while having fun • Ages 10-12</p>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="background-decorations">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-marble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25, 0],
              x: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {['💎', '⚡', '🌟', '💛', '🎯'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

