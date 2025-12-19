import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import './StudentName.css';

export const StudentName: React.FC = () => {
  const [name, setName] = useState('');
  const { setStudentName, setScene } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      setStudentName(name.trim());
      setScene('menu');
    }
  };

  return (
    <div className="student-name-scene">
      <motion.div
        className="name-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <motion.div
          className="welcome-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1>⛰️ Welcome to Marble Roller Race! 🏁</h1>
          <p className="subtitle">Learn about Kinetic Energy through fun!</p>
        </motion.div>

        {/* Character Illustration */}
        <motion.div
          className="character-illustration"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <div className="character-icon">🎱💨</div>
        </motion.div>

        {/* Name Input Form */}
        <motion.form
          className="name-form"
          onSubmit={handleSubmit}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="studentName">
            <span className="label-icon">👤</span>
            What's your name?
          </label>
          
          <input
            id="studentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name here..."
            className="name-input"
            autoFocus
            maxLength={30}
          />

          <button 
            type="submit" 
            className="start-btn"
            disabled={!name.trim()}
          >
            Start Learning! 🚀
          </button>
        </motion.form>

        {/* Info Text */}
        <motion.div
          className="info-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            <span className="info-icon">💡</span>
            We'll track your progress as you race marbles from peak to ground!
          </p>
          <p className="age-info">Perfect for ages 10-12 • Learn Physics!</p>
        </motion.div>
      </motion.div>

      {/* Background Decorations */}
      <div className="background-elements">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-element"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {['⛰️', '🏁', '⭐', '💛', '⚡', '🎯', '🎱', '📚'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

