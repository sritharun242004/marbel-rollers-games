import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { LEVELS } from '../data/levels';
import './LevelSelect.css';

export const LevelSelect: React.FC = () => {
  const { levelsCompleted, starsEarned, startLevel, setScene } = useGameStore();

  const getLevelStars = (levelNumber: number): number => {
    // For simplicity, we'll estimate stars based on completion
    // In a real app, you'd track this per level
    return levelsCompleted.includes(levelNumber) ? 3 : 0;
  };

  // Debug log
  console.log('🎮 Level Select - Completed Levels:', levelsCompleted);

  return (
    <div className="level-select">
      <div className="level-select-container">
        <motion.div
          className="level-select-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button className="back-btn" onClick={() => setScene('menu')}>
            ← Back
          </button>
          <h1>Select Level</h1>
          <div className="total-progress">
            <span>⭐ {starsEarned}/30</span>
          </div>
        </motion.div>

        <div className="levels-grid">
          {LEVELS.map((level, index) => {
            // Fix: To unlock level N, check if level N-1 is completed
            // Level 1 (index 0) is always unlocked
            // Level 2 (index 1) unlocks when level 1 is completed (levelsCompleted.includes(1))
            const isUnlocked = index === 0 || levelsCompleted.includes(level.levelNumber - 1);
            const stars = getLevelStars(level.levelNumber);
            const isCompleted = levelsCompleted.includes(level.levelNumber);
            
            console.log(`Level ${level.levelNumber} (index ${index}):`, {
              isUnlocked,
              isCompleted,
              needsLevel: level.levelNumber - 1,
              hasLevel: levelsCompleted.includes(level.levelNumber - 1)
            });

            return (
              <motion.div
                key={level.levelNumber}
                className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && startLevel(level.levelNumber)}
              >
                <div className="level-number">
                  {isUnlocked ? level.levelNumber : '🔒'}
                </div>

                <div className="level-preview">
                  {isUnlocked ? (
                    <div className="preview-icon">
                      {level.tutorial && '📚'}
                      {!level.tutorial && level.obstacles.length > 0 && '🎢'}
                      {!level.tutorial && level.stars.length > 2 && '⭐'}
                      {!level.tutorial && level.obstacles.length === 0 && level.stars.length <= 2 && '🎯'}
                    </div>
                  ) : (
                    <div className="locked-overlay">LOCKED</div>
                  )}
                </div>

                <h3 className="level-name">{level.levelName}</h3>
                <p className="level-description">{level.description}</p>

                {isUnlocked && (
                  <div className="level-stars">
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={i <= stars ? 'earned' : 'empty'}>
                        {i <= stars ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                )}

                {!isUnlocked && (
                  <div className="unlock-requirement">
                    Complete Level {index} to unlock
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

