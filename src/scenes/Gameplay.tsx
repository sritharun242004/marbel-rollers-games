import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { GameHUD } from '../components/UI/GameHUD';
import { physicsEngine } from '../engine/PhysicsEngine';
import type { PathPoint } from '../utils/types';
import confetti from 'canvas-confetti';
import './Gameplay.css';

export const Gameplay: React.FC = () => {
  const {
    levelData,
    drawnPath,
    marble,
    starsCollected,
    isPlaying,
    isPaused,
    setDrawnPath,
    updateMarble,
    collectStar,
    setPlaying,
    setPaused,
    updateTime,
    completeLevel,
    resetLevel,
    setScene,
  } = useGameStore();

  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused || !levelData || drawnPath.length < 2) {
      return;
    }

    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Update time
      updateTime(deltaTime as number);

      // Update marble physics
      const newMarble = physicsEngine.updateMarble(marble, drawnPath, deltaTime);

      // Check star collisions - MORE FORGIVING
      levelData.stars.forEach(star => {
        if (!starsCollected.includes(star.id)) {
          // Check if marble is near star AND has correct speed
          const distToStar = Math.sqrt(
            Math.pow(newMarble.position.x - star.position.x, 2) + 
            Math.pow(newMarble.position.y - star.position.y, 2)
          );
          const speedDiff = Math.abs(newMarble.velocity - star.requiredSpeed);
          
          // More generous tolerance - 2x the star's tolerance + 5 mph buffer
          const effectiveTolerance = (star.tolerance * 2) + 5;
          
          // Debug logging
          if (distToStar < 80) {
            console.log(`🎯 Near star ${star.id}:`, {
              distance: Math.round(distToStar),
              currentSpeed: Math.round(newMarble.velocity),
              requiredSpeed: star.requiredSpeed,
              speedDiff: Math.round(speedDiff),
              tolerance: effectiveTolerance,
              willCollect: distToStar < 70 && speedDiff <= effectiveTolerance
            });
          }
          
          // Increased collection radius to 70px and more forgiving speed tolerance
          if (distToStar < 70 && speedDiff <= effectiveTolerance) {
            console.log(`✅ COLLECTING STAR ${star.id}!`);
            collectStar(star.id);
            
            // Celebration effect
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { 
                x: star.position.x / 800, 
                y: star.position.y / 600 
              },
              colors: ['#FFD700', '#FFA500', '#FF6B6B']
            });

            // Haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate([50, 30, 50]);
            }
            
            console.log(`⭐ Star ${star.id} collected! Speed: ${Math.round(newMarble.velocity)} mph (required: ${star.requiredSpeed} ± ${effectiveTolerance})`);
          }
        }
      });

      // Check if reached finish
      if (physicsEngine.checkFinishLine(newMarble, levelData.finishPosition)) {
        setPlaying(false);
        
        console.log('🏁 Reached finish line!', { 
          starsCollected: starsCollected.length,
          requiredStars: levelData.requiredStars
        });
        
        // Complete level with current stars collected
        setTimeout(() => {
          // Get the latest starsCollected from store
          const currentStars = useGameStore.getState().starsCollected.length;
          console.log('✅ Completing level with stars:', currentStars);
          completeLevel(currentStars);
        }, 500);

        // Big celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        return;
      }

      updateMarble(newMarble);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isPaused, levelData, drawnPath, marble, starsCollected]);

  const handlePathComplete = (path: PathPoint[]) => {
    setDrawnPath(path);
  };

  const handleGo = () => {
    if (drawnPath.length < 2) return;
    lastTimeRef.current = Date.now();
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    setPaused(false);
    resetLevel();
  };

  const handlePause = () => {
    setPaused(!isPaused);
  };

  const handleBackToMenu = () => {
    setScene('menu');
  };

  if (!levelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gameplay-scene">
      <div className="gameplay-header">
        <button className="back-btn" onClick={handleBackToMenu}>
          ← Back to Menu
        </button>
      </div>

      <div className="gameplay-container">
        <DrawingCanvas onPathComplete={handlePathComplete} />
        
        <GameHUD
          onGo={handleGo}
          onReset={handleReset}
          onPause={handlePause}
          canStart={drawnPath.length > 1}
        />
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-menu">
            <h2>⏸️ PAUSED</h2>
            <button onClick={() => setPaused(false)} className="resume-btn">
              ▶️ Resume
            </button>
            <button onClick={handleReset} className="restart-btn">
              ↺ Restart
            </button>
            <button onClick={handleBackToMenu} className="menu-btn">
              🏠 Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

