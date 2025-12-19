import { motion } from 'framer-motion';
import type { MarbleState } from '../utils/types';
import { getColorForSpeed } from '../utils/helpers';
import { GAME_CONFIG } from '../utils/constants';
import './Marble.css';

interface MarbleProps {
  marble: MarbleState;
}

export const Marble: React.FC<MarbleProps> = ({ marble }) => {
  const color = getColorForSpeed(marble.velocity);
  const glowIntensity = Math.min(marble.KE / 500, 1);
  const trailLength = Math.min(Math.floor(marble.velocity / 3), 20);
  
  // Calculate rotation angle for rolling ball
  const rotationAngle = marble.rotation || 0;

  return (
    <>
      {/* Energy glow effect */}
      {marble.isRolling && glowIntensity > 0.2 && (
        <motion.div
          className="energy-glow"
          style={{
            left: marble.position.x - GAME_CONFIG.MARBLE_RADIUS * 2,
            top: marble.position.y - GAME_CONFIG.MARBLE_RADIUS * 2,
            width: GAME_CONFIG.MARBLE_RADIUS * 4,
            height: GAME_CONFIG.MARBLE_RADIUS * 4,
            background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        />
      )}

      {/* Particle trail */}
      {marble.isRolling && trailLength > 0 && (
        <div className="marble-trail">
          {Array.from({ length: trailLength }).map((_, i) => (
            <motion.div
              key={i}
              className="trail-particle"
              style={{
                left: marble.position.x - i * 4,
                top: marble.position.y,
                backgroundColor: color,
                opacity: 1 - i / trailLength,
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      )}

      {/* Marble Boulder - positioned so it rolls ON TOP of the path line */}
      <motion.div
        className="marble"
        style={{
          left: marble.position.x,
          // Position so the BOTTOM of the marble sits ON the path line
          // Subtract full diameter (2 * radius) so bottom edge is at path y-coordinate
          top: marble.position.y - (GAME_CONFIG.MARBLE_RADIUS * 2),
          width: GAME_CONFIG.MARBLE_RADIUS * 2,
          height: GAME_CONFIG.MARBLE_RADIUS * 2,
          borderRadius: '50%',
          // Center horizontally only, no vertical offset needed
          transform: `translate(-50%, 0%) rotate(${rotationAngle}deg)`,
          // Rock texture with color based on speed
          background: `
            radial-gradient(circle at 30% 30%, ${color}dd, ${color}44),
            radial-gradient(circle at 70% 60%, rgba(0,0,0,0.3), transparent),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2), transparent),
            linear-gradient(135deg, ${color}88, ${color}dd)
          `,
          border: `2px solid ${color}aa`,
          boxShadow: `
            0 4px 8px rgba(0,0,0,0.4),
            0 0 ${glowIntensity * 15}px ${color},
            inset -8px -8px 16px rgba(0,0,0,0.4),
            inset 8px 8px 16px rgba(255,255,255,0.2)
          `,
          filter: `
            drop-shadow(0 2px 4px rgba(0,0,0,0.5))
            contrast(1.1)
            brightness(${0.8 + glowIntensity * 0.4})
          `,
        }}
        animate={{
          scale: marble.isRolling ? [1, 1.02, 1] : 1,
        }}
        transition={{
          scale: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Rock surface texture - ENHANCED for visible rotation */}
        {/* Bold stripe to show rotation clearly */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '70%',
            height: '6px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            borderRadius: '3px',
            boxShadow: '0 0 3px rgba(0,0,0,0.4)',
          }}
        />
        {/* Cross stripe for even more visible rotation */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '70%',
            height: '6px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            borderRadius: '3px',
            boxShadow: '0 0 3px rgba(0,0,0,0.4)',
          }}
        />
        {/* Highlight spot to track rotation */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 4px rgba(255,255,255,0.8), inset 0 0 4px rgba(0,0,0,0.3)',
          }}
        />
        {/* Additional texture spots */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '25%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '70%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />
        
        {/* Speed lines for fast movement */}
        {marble.velocity > 40 && (
          <div className="speed-lines-container">
            <div className="speed-line" style={{ backgroundColor: color }} />
            <div className="speed-line" style={{ backgroundColor: color }} />
            <div className="speed-line" style={{ backgroundColor: color }} />
          </div>
        )}
      </motion.div>

      {/* Motion blur effect for high speeds */}
      {marble.velocity > 30 && (
        <motion.div
          className="motion-blur"
          style={{
            left: marble.position.x - GAME_CONFIG.MARBLE_RADIUS * 2,
            top: marble.position.y - GAME_CONFIG.MARBLE_RADIUS,
            width: GAME_CONFIG.MARBLE_RADIUS * 4,
            height: GAME_CONFIG.MARBLE_RADIUS * 2,
            background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
          }}
          animate={{ opacity: Math.min(marble.velocity / 60, 0.6) }}
        />
      )}
    </>
  );
};

