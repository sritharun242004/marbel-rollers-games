import type { Vector2D, PathPoint } from './types';
import { COLORS, SPEED_THRESHOLDS } from './constants';

// Calculate distance between two points
export function distance(p1: Vector2D, p2: Vector2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate angle between two points (in radians)
export function angle(p1: Vector2D, p2: Vector2D): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

// Get color based on speed
export function getColorForSpeed(speed: number): string {
  if (speed < SPEED_THRESHOLDS.LOW) return COLORS.NO_KE;
  if (speed < SPEED_THRESHOLDS.MEDIUM) return COLORS.LOW_KE;
  if (speed < SPEED_THRESHOLDS.HIGH) return COLORS.MEDIUM_KE;
  if (speed < SPEED_THRESHOLDS.ULTRA) return COLORS.HIGH_KE;
  return COLORS.ULTRA_KE;
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Check if point is within bounds
export function isInBounds(
  point: Vector2D,
  width: number,
  height: number,
  margin: number = 0
): boolean {
  return (
    point.x >= margin &&
    point.x <= width - margin &&
    point.y >= margin &&
    point.y <= height - margin
  );
}

// Simple AABB collision detection
export function checkAABBCollision(
  pos1: Vector2D,
  size1: Vector2D,
  pos2: Vector2D,
  size2: Vector2D
): boolean {
  return (
    pos1.x < pos2.x + size2.x &&
    pos1.x + size1.x > pos2.x &&
    pos1.y < pos2.y + size2.y &&
    pos1.y + size1.y > pos2.y
  );
}

// Smooth path using simple averaging
export function smoothPath(points: PathPoint[], smoothingFactor: number = 0.3): PathPoint[] {
  if (points.length < 3) return points;
  
  const smoothed: PathPoint[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    smoothed.push({
      x: lerp(curr.x, (prev.x + next.x) / 2, smoothingFactor),
      y: lerp(curr.y, (prev.y + next.y) / 2, smoothingFactor),
      timestamp: curr.timestamp,
    });
  }
  
  smoothed.push(points[points.length - 1]);
  return smoothed;
}

// Reduce path points while maintaining shape
export function reducePath(points: PathPoint[], tolerance: number = 5): PathPoint[] {
  if (points.length < 3) return points;
  
  const reduced: PathPoint[] = [points[0]];
  let lastPoint = points[0];
  
  for (let i = 1; i < points.length - 1; i++) {
    const dist = distance(lastPoint, points[i]);
    if (dist >= tolerance) {
      reduced.push(points[i]);
      lastPoint = points[i];
    }
  }
  
  reduced.push(points[points.length - 1]);
  return reduced;
}

// Save to localStorage
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Load from localStorage
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}
