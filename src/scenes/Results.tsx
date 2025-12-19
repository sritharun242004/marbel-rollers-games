import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import confetti from 'canvas-confetti';
import './Results.css';

export const Results: React.FC = () => {
  const {
    levelData,
    marble,
    starsCollected,
    timeElapsed,
    currentLevel,
    studentName,
    setScene,
    startLevel,
  } = useGameStore();

  const [showElements, setShowElements] = useState(false);

  const starsEarned = starsCollected.length;
  const isPerfect = levelData && starsEarned === levelData.stars.length && timeElapsed <= levelData.parTime;
  const passed = levelData && starsEarned >= levelData.requiredStars;

  useEffect(() => {
    // Trigger confetti
    if (isPerfect) {
      // Epic confetti for perfect run
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#9400d3']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#9400d3']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (passed) {
      // Regular celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Show elements with delay
    setTimeout(() => setShowElements(true), 500);
  }, [isPerfect, passed]);

  const handleNextLevel = () => {
    if (currentLevel < 10) {
      startLevel(currentLevel + 1);
    } else {
      setScene('completion');
    }
  };

  const handleRetry = () => {
    startLevel(currentLevel);
  };

  const handleMenu = () => {
    setScene('levelSelect');
  };

  if (!levelData) return null;

  return (
    <div className="results-scene">
      <motion.div
        className="results-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Student Name */}
        {studentName && (
          <motion.div
            className="student-name-display"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p>👤 {studentName}</p>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className={`results-title ${isPerfect ? 'perfect' : passed ? 'passed' : 'try-again'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {isPerfect && '🌟 PERFECT! 🌟'}
          {!isPerfect && passed && '✅ LEVEL COMPLETE!'}
          {!passed && '😊 GOOD TRY!'}
        </motion.h1>

        {/* Stars */}
        {showElements && (
          <div className="stars-earned">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="star-result"
                initial={{ y: -100, rotate: 0, scale: 0 }}
                animate={{
                  y: 0,
                  rotate: 360,
                  scale: i <= starsEarned ? 1 : 0.5,
                }}
                transition={{
                  delay: 0.7 + i * 0.2,
                  type: 'spring',
                  stiffness: 150,
                }}
              >
                {i <= starsEarned ? '⭐' : '☆'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {showElements && (
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="stat-card">
              <div className="stat-icon">🏎️</div>
              <div className="stat-label">Final Speed</div>
              <div className="stat-value">{Math.round(marble.velocity)} mph</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💛</div>
              <div className="stat-label">Max KE</div>
              <div className="stat-value">{Math.round(marble.KE)} units</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-label">Time</div>
              <div className="stat-value">
                {Math.floor(timeElapsed / 60)}:{(Math.floor(timeElapsed % 60)).toString().padStart(2, '0')}
              </div>
              {timeElapsed <= levelData.parTime && (
                <div className="stat-bonus">Under par! 🎉</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Learning recap */}
        {showElements && (
          <motion.div
            className="learning-recap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <h3>🎓 What You Learned:</h3>
            <ul>
              <li>✓ Kinetic Energy = Energy of motion</li>
              <li>✓ Faster speed = More KE</li>
              <li>✓ KE = ½ × mass × speed²</li>
            </ul>
          </motion.div>
        )}

        {/* Speedy Bot comment */}
        {showElements && (
          <motion.div
            className="speedybot-comment"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="bot-avatar">🏃‍♂️</div>
            <div className="speech-bubble">
              {isPerfect && "WOW! Alex got home super fast! You're a KE Master! 🏆"}
              {!isPerfect && passed && "Great job! Alex made it home safely using Kinetic Energy! 💪"}
              {!passed && "Good effort! Try making the path steeper to help Alex go faster! 🎯"}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        {showElements && (
          <motion.div
            className="results-buttons"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
          >
            {passed && currentLevel < 10 && (
              <button className="next-level-btn" onClick={handleNextLevel}>
                Next Level ➡️
              </button>
            )}
            {passed && currentLevel === 10 && (
              <button className="next-level-btn" onClick={() => setScene('completion')}>
                View Completion 🏆
              </button>
            )}
            <button className="retry-btn" onClick={handleRetry}>
              ↺ Try Again
            </button>
            <button className="menu-btn" onClick={handleMenu}>
              🏠 Level Select
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

