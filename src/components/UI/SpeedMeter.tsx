import { motion } from 'framer-motion';
import { getColorForSpeed } from '../../utils/helpers';
import './SpeedMeter.css';

interface SpeedMeterProps {
  currentSpeed: number;
  maxSpeed?: number;
}

export const SpeedMeter: React.FC<SpeedMeterProps> = ({ currentSpeed, maxSpeed = 60 }) => {
  const percentage = Math.min((currentSpeed / maxSpeed) * 100, 100);
  const color = getColorForSpeed(currentSpeed);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className="speed-meter">
      <div className="meter-label">SPEED</div>
      
      <svg width="100" height="100" viewBox="0 0 100 100" className="speed-gauge">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ddd"
          strokeWidth="10"
        />
        
        {/* Filled circle (animated) */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        
        {/* Center text */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          fontSize="24"
          fill={color}
          fontWeight="bold"
          className="speed-value"
        >
          {Math.round(currentSpeed)}
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="10"
          fill="#666"
        >
          mph
        </text>
      </svg>

      <div className="speed-zones">
        <div className={`zone slow ${currentSpeed < 20 ? 'active' : ''}`}>
          <span className="zone-dot">●</span> 0-20
        </div>
        <div className={`zone medium ${currentSpeed >= 20 && currentSpeed < 40 ? 'active' : ''}`}>
          <span className="zone-dot">●</span> 20-40
        </div>
        <div className={`zone fast ${currentSpeed >= 40 ? 'active' : ''}`}>
          <span className="zone-dot">●</span> 40+
        </div>
      </div>
    </div>
  );
};

