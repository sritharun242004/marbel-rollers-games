import { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { StudentName } from './scenes/StudentName';
import { MainMenu } from './scenes/MainMenu';
import { LevelSelect } from './scenes/LevelSelect';
import { Gameplay } from './scenes/Gameplay';
import { Results } from './scenes/Results';
import './App.css';

function App() {
  const { currentScene, studentName, loadProgress } = useGameStore();

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Render current scene
  const renderScene = () => {
    // If no student name, show name input
    if (!studentName && currentScene !== 'splash') {
      return <StudentName />;
    }

    switch (currentScene) {
      case 'splash':
        return <StudentName />;
      case 'menu':
        return <MainMenu />;
      case 'levelSelect':
        return <LevelSelect />;
      case 'gameplay':
        return <Gameplay />;
      case 'results':
        return <Results />;
      case 'completion':
        return (
          <div className="completion-scene">
            <div className="completion-container">
              <h1>🏆 CONGRATULATIONS! 🏆</h1>
              <p className="completion-text">
                You've completed all 10 levels and mastered Kinetic Energy!
              </p>
              <div className="completion-stats">
                <div className="stat">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-label">You now understand:</div>
                  <ul>
                    <li>✓ Kinetic Energy = Energy of Motion</li>
                    <li>✓ KE = ½ × mass × speed²</li>
                    <li>✓ Speed and Energy Relationships</li>
                  </ul>
                </div>
              </div>
              <button
                className="completion-btn"
                onClick={() => useGameStore.getState().setScene('menu')}
              >
                Back to Menu
              </button>
            </div>
          </div>
        );
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app">
      {renderScene()}
    </div>
  );
}

export default App;
