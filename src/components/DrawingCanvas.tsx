import React, { useRef, useEffect, useState, type TouchEvent, type MouseEvent } from 'react';
import type { PathPoint, Vector2D } from '../utils/types';
import { COLORS, GAME_CONFIG } from '../utils/constants';
import { distance, smoothPath, reducePath, isInBounds } from '../utils/helpers';
import { Marble } from './Marble';
import { useGameStore } from '../stores/gameStore';
import './DrawingCanvas.css';

interface DrawingCanvasProps {
  onPathComplete: (path: PathPoint[]) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onPathComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  const [isValidPath, setIsValidPath] = useState(true);
  
  const { levelData, marble, starsCollected, setDrawing } = useGameStore();

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = GAME_CONFIG.CANVAS_WIDTH;
      canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !levelData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (highly visible)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.5;
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw thicker lines every 100px for better reference
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw start marker (PEAK)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(levelData.startPosition.x, levelData.startPosition.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⛰️', levelData.startPosition.x, levelData.startPosition.y - 5);
    ctx.font = 'bold 10px Arial';
    ctx.fillText('PEAK', levelData.startPosition.x, levelData.startPosition.y + 10);

    // Draw finish marker (GROUND)
    ctx.fillStyle = '#4ECB71';
    ctx.beginPath();
    ctx.arc(levelData.finishPosition.x, levelData.finishPosition.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🏁', levelData.finishPosition.x, levelData.finishPosition.y - 5);
    ctx.font = 'bold 10px Arial';
    ctx.fillText('GROUND', levelData.finishPosition.x, levelData.finishPosition.y + 10);

    // Draw obstacles
    levelData.obstacles.forEach(obstacle => {
      if (obstacle.type === 'gap') {
        ctx.fillStyle = '#333';
        ctx.fillRect(
          obstacle.position.x,
          obstacle.position.y,
          obstacle.size.x,
          obstacle.size.y
        );
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAP', obstacle.position.x + obstacle.size.x / 2, obstacle.position.y + obstacle.size.y / 2);
      } else if (obstacle.type === 'wall') {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
          obstacle.position.x,
          obstacle.position.y,
          obstacle.size.x,
          obstacle.size.y
        );
      }
    });

    // Draw stars
    levelData.stars.forEach(star => {
      const collected = starsCollected.includes(star.id);
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        collected ? '⭐' : '☆',
        star.position.x,
        star.position.y
      );

      // Draw speed requirement
      if (!collected) {
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(
          `${star.requiredSpeed} mph`,
          star.position.x,
          star.position.y + 25
        );
      }
    });

    // Draw current path (more visible)
    if (currentPath.length > 0) {
      // Draw shadow for better visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y + 2);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y + 2);
      });
      ctx.stroke();
      
      // Draw main path
      ctx.strokeStyle = isValidPath ? COLORS.RAMP : COLORS.RAMP_INVALID;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Draw sparkles while drawing
      if (isDrawing) {
        const lastPoint = currentPath[currentPath.length - 1];
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI * 2 * i) / 3 + Date.now() / 200;
          const x = lastPoint.x + Math.cos(angle) * 15;
          const y = lastPoint.y + Math.sin(angle) * 15;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw hint line (dotted) from peak to ground if no path
    if (currentPath.length === 0 && levelData.tutorial) {
      ctx.setLineDash([5, 10]);
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(levelData.startPosition.x, levelData.startPosition.y);
      ctx.lineTo(levelData.finishPosition.x, levelData.finishPosition.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [levelData, currentPath, isDrawing, isValidPath, starsCollected]);

  const getCanvasCoordinates = (clientX: number, clientY: number): Vector2D => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_CONFIG.CANVAS_WIDTH / rect.width;
    const scaleY = GAME_CONFIG.CANVAS_HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (!levelData) return;

    const point = getCanvasCoordinates(clientX, clientY);

    // Check if starting near PEAK marker
    const distToStart = distance(point, levelData.startPosition);
    if (distToStart > 60) return;

    setIsDrawing(true);
    setDrawing(true);
    // CRITICAL FIX: Start path at EXACT PEAK position (not user's touch point)
    setCurrentPath([{ ...levelData.startPosition, timestamp: Date.now() }]);
    setIsValidPath(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !levelData) return;

    const point = getCanvasCoordinates(clientX, clientY);

    // Check if in bounds
    if (!isInBounds(point, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT, 10)) {
      setIsValidPath(false);
      return;
    }

    // Add point if moved enough distance
    const lastPoint = currentPath[currentPath.length - 1];
    if (distance(lastPoint, point) > 5) {
      setCurrentPath(prev => [...prev, { ...point, timestamp: Date.now() }]);
    }
  };

  const handleEnd = () => {
    if (!isDrawing || !levelData) return;

    setIsDrawing(false);
    setDrawing(false);

    // Check if path reaches ground
    const lastPoint = currentPath[currentPath.length - 1];
    const distToFinish = distance(lastPoint, levelData.finishPosition);

    if (distToFinish < 60 && currentPath.length > 10) {
      // CRITICAL FIX: Snap last point to EXACT GROUND position
      const pathWithFixedEnd = [...currentPath.slice(0, -1), { ...levelData.finishPosition, timestamp: Date.now() }];
      
      // Process path
      const smoothedPath = smoothPath(pathWithFixedEnd);
      const reducedPath = reducePath(smoothedPath, 10);
      onPathComplete(reducedPath);
    } else {
      // Invalid path - clear it
      setCurrentPath([]);
      setIsValidPath(true);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleEnd();
  };

  // Mouse handlers
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <Marble marble={marble} />
    </div>
  );
};

