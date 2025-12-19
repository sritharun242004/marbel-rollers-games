import { motion } from 'framer-motion';
import { GAME_CONFIG } from '../../utils/constants';
import './KEMeter.css';

interface KEMeterProps {
  currentKE: number;
  currentSpeed: number;
  maxKE?: number;
}

export const KEMeter: React.FC<KEMeterProps> = ({ currentKE, currentSpeed, maxKE = 30000 }) => {
  const percentage = Math.min((currentKE / maxKE) * 100, 100);
  const mass = GAME_CONFIG.MARBLE_MASS;
  
  // Live calculation display
  const speedRounded = Math.round(currentSpeed);
  const halfMass = mass / 2;
  const speedSquared = speedRounded * speedRounded;
  const calculatedKE = Math.round(halfMass * speedSquared);

  return (
    <div className="ke-meter">
      <div className="ke-header">
        <div className="meter-label">KINETIC ENERGY 💛</div>
        <div className="ke-value">{Math.round(currentKE)} J</div>
      </div>

      <div className="ke-bar-container">
        <motion.div
          className="ke-bar-fill"
          style={{
            width: `${percentage}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Animated particles */}
          {currentKE > 0 && (
            <>
              {Array.from({ length: Math.floor(percentage / 15) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="ke-particle"
                  initial={{ left: '0%', opacity: 1 }}
                  animate={{ left: '100%', opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'linear',
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Percentage markers */}
        <div className="ke-markers">
          <span>0</span>
          <span>7.5k</span>
          <span>15k</span>
          <span>22.5k</span>
          <span>30k</span>
        </div>
      </div>

      {/* LIVE CALCULATOR */}
      <div className="ke-calculator">
        <div className="calculator-title">🧮 Live Calculator:</div>
        <div className="calculator-formula">
          <div className="formula-line">
            <span className="formula-label">KE = </span>
            <span className="formula-value">½</span>
            <span className="formula-operator"> × </span>
            <span className="formula-value highlight-mass">{mass} kg</span>
            <span className="formula-operator"> × </span>
            <span className="formula-value highlight-speed">{speedRounded}²</span>
          </div>
          <div className="formula-line calculation">
            <span className="formula-label">KE = </span>
            <span className="formula-value">{halfMass}</span>
            <span className="formula-operator"> × </span>
            <span className="formula-value highlight-speed">{speedSquared}</span>
            <span className="formula-operator"> = </span>
            <motion.span 
              className="formula-result"
              key={calculatedKE}
              initial={{ scale: 1.2, color: '#FFD700' }}
              animate={{ scale: 1, color: '#4169E1' }}
              transition={{ duration: 0.3 }}
            >
              {calculatedKE} J
            </motion.span>
          </div>
        </div>
      </div>

      <div className="ke-info">
        💡 Mass = {mass} kg (Marble)
      </div>
    </div>
  );
};

