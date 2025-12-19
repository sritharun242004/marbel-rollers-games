import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { SpeedMeter } from './SpeedMeter';
import { KEMeter } from './KEMeter';
import { formatTime } from '../../utils/helpers';
import './GameHUD.css';

interface GameHUDProps {
  onGo: () => void;
  onReset: () => void;
  onPause: () => void;
  canStart: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onGo, onReset, onPause, canStart }) => {
  const { levelData, marble, starsCollected, timeElapsed, isPlaying } = useGameStore();

  if (!levelData) return null;

  return (
    <div className="game-hud">
      {/* Top Bar */}
      <div className="hud-top-bar">
        <div className="level-info">
          <h2>Level {levelData.levelNumber}</h2>
          <p>{levelData.levelName}</p>
        </div>

        {/* Stars Display */}
        {levelData.stars.length > 0 && (
          <div className="stars-display">
            {levelData.stars.map((star) => (
              <div key={star.id} className="star-indicator">
                <span className={starsCollected.includes(star.id) ? 'collected' : 'not-collected'}>
                  {starsCollected.includes(star.id) ? '⭐' : '☆'}
                </span>
                <span className="star-speed">{star.requiredSpeed} mph</span>
              </div>
            ))}
          </div>
        )}

        <div className="hud-top-right">
          <div className="timer">⏱️ {formatTime(timeElapsed)}</div>
          <button className="pause-btn" onClick={onPause} disabled={!isPlaying}>
            ⏸️
          </button>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="hud-bottom">
        {/* Left side - Meters */}
        <div className="hud-meters">
          <SpeedMeter currentSpeed={marble.velocity} />
          <KEMeter currentKE={marble.KE} currentSpeed={marble.velocity} />
        </div>

        {/* Right side - Controls */}
        <div className="hud-controls">
          <motion.button
            className="go-btn"
            onClick={onGo}
            disabled={!canStart || isPlaying}
            whileHover={{ scale: canStart && !isPlaying ? 1.05 : 1 }}
            whileTap={{ scale: canStart && !isPlaying ? 0.95 : 1 }}
          >
            {isPlaying ? '🏁 Racing...' : '🚀 GO!'}
          </motion.button>

          <motion.button
            className="reset-btn"
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↺ Reset
          </motion.button>
        </div>
      </div>

      {/* Instructions */}
      {!canStart && !isPlaying && (
        <motion.div
          className="instructions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p>👆 Draw a path from PEAK ⛰️ to GROUND 🏁!</p>
        </motion.div>
      )}

      {/* Mobile Floating GO Button - appears after drawing */}
      {canStart && !isPlaying && (
        <motion.button
          className="mobile-floating-go"
          onClick={onGo}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          whileTap={{ scale: 0.9 }}
        >
          🚀 START!
        </motion.button>
      )}
    </div>
  );
};

