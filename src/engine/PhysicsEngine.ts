import type { Vector2D, PathPoint, PathSegment, MarbleState, Star, Obstacle } from '../utils/types';
import { GAME_CONFIG } from '../utils/constants';
import { distance, angle } from '../utils/helpers';

export class PhysicsEngine {
  private gravity: number = GAME_CONFIG.GRAVITY;
  private marbleMass: number = GAME_CONFIG.MARBLE_MASS;
  private friction: number = GAME_CONFIG.FRICTION;
  
  // Calculate KE from velocity
  calculateKE(velocity: number): number {
    // KE = 0.5 * m * v²
    return 0.5 * this.marbleMass * velocity * velocity;
  }
  
  // Calculate speed from height drop
  calculateSpeedFromHeight(heightDrop: number): number {
    // v = sqrt(2 * g * h)
    return Math.sqrt(2 * this.gravity * Math.max(0, heightDrop));
  }
  
  // Convert path points to segments
  pathToSegments(path: PathPoint[]): PathSegment[] {
    const segments: PathSegment[] = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      const segmentAngle = angle(start, end);
      const segmentLength = distance(start, end);
      
      segments.push({
        start,
        end,
        angle: segmentAngle,
        length: segmentLength,
      });
    }
    
    return segments;
  }
  
  // Find which segment the marble is on
  findCurrentSegment(marble: Vector2D, segments: PathSegment[]): number {
    let minDist = Infinity;
    let segmentIndex = 0;
    
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const dist = this.distanceToSegment(marble, seg.start, seg.end);
      
      if (dist < minDist) {
        minDist = dist;
        segmentIndex = i;
      }
    }
    
    return segmentIndex;
  }
  
  // Calculate distance from point to line segment
  private distanceToSegment(point: Vector2D, lineStart: Vector2D, lineEnd: Vector2D): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Helper: Find closest point on line segment with t parameter
  private closestPointOnSegment(point: Vector2D, lineStart: Vector2D, lineEnd: Vector2D): {
    point: Vector2D;
    t: number;
  } {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) return { point: lineStart, t: 0 };
    
    let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    
    return {
      point: {
        x: lineStart.x + t * dx,
        y: lineStart.y + t * dy
      },
      t
    };
  }
  
  // Helper: Normalize vector
  private normalize(v: Vector2D): Vector2D {
    const length = Math.sqrt(v.x * v.x + v.y * v.y);
    if (length === 0) return { x: 0, y: 0 };
    return {
      x: v.x / length,
      y: v.y / length
    };
  }
  
  // Helper: Find position on path given distance traveled from start point
  private findPositionOnPath(
    startPoint: Vector2D,
    startSegmentIndex: number,
    distanceToTravel: number,
    segments: PathSegment[]
  ): { position: Vector2D; segmentIndex: number } {
    if (distanceToTravel <= 0) {
      return { position: startPoint, segmentIndex: startSegmentIndex };
    }
    
    let remainingDistance = distanceToTravel;
    let currentSegmentIndex = startSegmentIndex;
    
    // Start from the current position on the segment (using t parameter)
    const startSegment = segments[currentSegmentIndex];
    if (!startSegment) {
      return { position: startPoint, segmentIndex: currentSegmentIndex };
    }
    
    // Calculate remaining distance on current segment from our position
    const dx = startSegment.end.x - startPoint.x;
    const dy = startSegment.end.y - startPoint.y;
    const distToSegmentEnd = Math.sqrt(dx * dx + dy * dy);
    
    // If we can reach the end of current segment
    if (remainingDistance >= distToSegmentEnd) {
      remainingDistance -= distToSegmentEnd;
      currentSegmentIndex++;
      
      // Continue along subsequent segments
      while (remainingDistance > 0 && currentSegmentIndex < segments.length) {
        const segment = segments[currentSegmentIndex];
        const segmentLength = distance(segment.start, segment.end);
        
        if (remainingDistance >= segmentLength) {
          // Move to next segment
          remainingDistance -= segmentLength;
          currentSegmentIndex++;
        } else {
          // Stop within this segment
          const segDx = segment.end.x - segment.start.x;
          const segDy = segment.end.y - segment.start.y;
          const ratio = remainingDistance / segmentLength;
          
          return {
            position: {
              x: segment.start.x + segDx * ratio,
              y: segment.start.y + segDy * ratio
            },
            segmentIndex: currentSegmentIndex
          };
        }
      }
      
      // Reached or passed the end of path
      const lastSegment = segments[segments.length - 1];
      return {
        position: { ...lastSegment.end },
        segmentIndex: segments.length - 1
      };
    } else {
      // Stay on current segment
      const ratio = remainingDistance / distToSegmentEnd;
      return {
        position: {
          x: startPoint.x + dx * ratio,
          y: startPoint.y + dy * ratio
        },
        segmentIndex: currentSegmentIndex
      };
    }
  }

  // Update marble physics with proper path following - CONSTRAINED TO PATH
  updateMarble(
    marble: MarbleState,
    path: PathPoint[],
    deltaTime: number
  ): MarbleState {
    if (path.length < 2) return marble;
    
    const segments = this.pathToSegments(path);
    
    // STEP 1: Find closest point on entire path and which segment we're on
    // This ensures the marble is ALWAYS snapped to the path
    let closestDist = Infinity;
    let closestPoint = marble.position;
    let closestSegmentIndex = 0;
    
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const result = this.closestPointOnSegment(marble.position, seg.start, seg.end);
      const dist = distance(marble.position, result.point);
      
      if (dist < closestDist) {
        closestDist = dist;
        closestPoint = result.point;
        closestSegmentIndex = i;
      }
    }
    
    // FORCE marble to be exactly on the path (no deviation allowed)
    // This is the key fix - marble position is ALWAYS on the path
    const currentSegment = segments[closestSegmentIndex];
    if (!currentSegment) return marble;
    
    // Calculate tangent (direction along path)
    const dx = currentSegment.end.x - currentSegment.start.x;
    const dy = currentSegment.end.y - currentSegment.start.y;
    const tangent = this.normalize({ x: dx, y: dy });
    
    // STEP 2: Calculate slope angle using tangent vector
    const slopeAngle = Math.atan2(tangent.y, tangent.x);
    
    // STEP 3: Calculate acceleration due to gravity on slope
    // Only the component of gravity along the slope matters
    const acceleration = this.gravity * Math.sin(slopeAngle);
    
    // STEP 4: Update velocity
    let newVelocity = marble.velocity + acceleration * deltaTime;
    
    // Apply friction
    newVelocity *= this.friction;
    
    // Ensure velocity doesn't go negative (marble can't roll backwards)
    newVelocity = Math.max(0, newVelocity);
    
    // STEP 5: Move marble along the path (not in free space!)
    const moveDistance = newVelocity * deltaTime;
    
    // Find new position by traveling along the path from our current snapped position
    const { position: newPosition } = 
      this.findPositionOnPath(closestPoint, closestSegmentIndex, moveDistance, segments);
    
    // IMPORTANT: Clamp position to canvas bounds to prevent marble going off-screen
    const clampedPosition = {
      x: Math.max(GAME_CONFIG.MARBLE_RADIUS, Math.min(newPosition.x, 800 - GAME_CONFIG.MARBLE_RADIUS)),
      y: Math.max(GAME_CONFIG.MARBLE_RADIUS, Math.min(newPosition.y, 600 - GAME_CONFIG.MARBLE_RADIUS))
    };
    
    // Calculate KE
    const newKE = this.calculateKE(newVelocity);
    
    // Update rotation based on distance traveled (angular displacement)
    // Formula: angle (degrees) = (arc length / radius) × (180/π)
    const rotationChange = (moveDistance / GAME_CONFIG.MARBLE_RADIUS) * (180 / Math.PI);
    const newRotation = (marble.rotation + rotationChange) % 360;
    
    // Check if marble reached end of path
    const endPoint = path[path.length - 1];
    const distToEnd = distance(clampedPosition, endPoint);
    const isAtEnd = distToEnd < GAME_CONFIG.MARBLE_RADIUS * 2;
    
    return {
      position: clampedPosition,
      velocity: newVelocity,
      KE: newKE,
      isRolling: newVelocity > 0.1 && !isAtEnd,
      isAirborne: false,
      rotation: newRotation,
    };
  }
  
  // Check collision with star
  checkStarCollision(marble: MarbleState, star: Star): boolean {
    const dist = distance(marble.position, star.position);
    const speedMatch = Math.abs(marble.velocity - star.requiredSpeed) <= star.tolerance;
    
    return dist < GAME_CONFIG.STAR_COLLECT_DISTANCE && speedMatch;
  }
  
  // Check collision with obstacle
  checkObstacleCollision(marble: MarbleState, obstacle: Obstacle): boolean {
    const marbleSize = { x: GAME_CONFIG.MARBLE_RADIUS * 2, y: GAME_CONFIG.MARBLE_RADIUS * 2 };
    
    return (
      marble.position.x < obstacle.position.x + obstacle.size.x &&
      marble.position.x + marbleSize.x > obstacle.position.x &&
      marble.position.y < obstacle.position.y + obstacle.size.y &&
      marble.position.y + marbleSize.y > obstacle.position.y
    );
  }
  
  // Check if marble reached finish line
  checkFinishLine(marble: MarbleState, finishPosition: Vector2D): boolean {
    const dist = distance(marble.position, finishPosition);
    return dist < GAME_CONFIG.MARBLE_RADIUS * 3;
  }
  
  // Calculate required speed to clear a gap
  calculateRequiredSpeedForJump(gapWidth: number): number {
    // Simple projectile motion: v = sqrt(g * d)
    return Math.sqrt(this.gravity * gapWidth);
  }
}

export const physicsEngine = new PhysicsEngine();

