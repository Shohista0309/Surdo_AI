import { HandLandmarkPoint, GestureDetectionResult } from '../types';

export class GestureDetector {
  // Thresholds with hysteresis
  public pinchEnterThreshold: number = 0.058; // Distance below which pinch starts
  public pinchExitThreshold: number = 0.088;  // Distance above which pinch releases

  private isPinching: boolean = false;
  private smoothX: number = 0.5;
  private smoothY: number = 0.5;
  private hasInitializedFilter: boolean = false;
  private smoothingAlpha: number = 0.38; // Balance between instant response and zero jitter

  /**
   * Reset filter when hand leaves or changes
   */
  public resetFilter() {
    this.hasInitializedFilter = false;
    this.isPinching = false;
  }

  /**
   * Analyzes 21 3D hand landmarks and returns high-level gesture data
   */
  public analyze(landmarks: HandLandmarkPoint[] | null): GestureDetectionResult {
    if (!landmarks || landmarks.length < 21) {
      this.isPinching = false;
      return {
        isHandDetected: false,
        landmarks: null,
        isPinching: false,
        pinchDistance: 1.0,
        pinchStrength: 0,
        screenPoint: { x: this.smoothX, y: this.smoothY },
        worldPoint: null,
        rawPinchDistance: 1.0
      };
    }

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    // Compute 3D distance between thumb tip and index finger tip
    const dx = thumbTip.x - indexTip.x;
    const dy = thumbTip.y - indexTip.y;
    // z has lower confidence/scaling in vision tasks, weight by 0.5
    const dz = (thumbTip.z - indexTip.z) * 0.5;
    const rawDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Hysteresis state machine
    if (!this.isPinching) {
      if (rawDistance < this.pinchEnterThreshold) {
        this.isPinching = true;
      }
    } else {
      if (rawDistance > this.pinchExitThreshold) {
        this.isPinching = false;
      }
    }

    // Midpoint between thumb and index finger tip
    // NOTE: Webcam image is mirrored horizontally so user moving right moves right on screen
    const rawMidX = 1 - (thumbTip.x + indexTip.x) / 2;
    const rawMidY = (thumbTip.y + indexTip.y) / 2;

    // Apply exponential smoothing (EMA) to eliminate webcam jitter
    if (!this.hasInitializedFilter) {
      this.smoothX = rawMidX;
      this.smoothY = rawMidY;
      this.hasInitializedFilter = true;
    } else {
      this.smoothX = this.smoothX * (1 - this.smoothingAlpha) + rawMidX * this.smoothingAlpha;
      this.smoothY = this.smoothY * (1 - this.smoothingAlpha) + rawMidY * this.smoothingAlpha;
    }

    // Clamp inside normalized screen boundaries
    const clampedX = Math.max(0.02, Math.min(0.98, this.smoothX));
    const clampedY = Math.max(0.02, Math.min(0.98, this.smoothY));

    // Calculate pinch strength percentage (0% = wide open, 100% = fully closed pinch)
    const maxDist = 0.18;
    const minDist = 0.04;
    const normalizedStrength = Math.max(0, Math.min(1, (maxDist - rawDistance) / (maxDist - minDist)));
    const pinchStrength = Math.round(normalizedStrength * 100);

    return {
      isHandDetected: true,
      landmarks,
      isPinching: this.isPinching,
      pinchDistance: rawDistance,
      pinchStrength,
      screenPoint: { x: clampedX, y: clampedY },
      worldPoint: null,
      rawPinchDistance: rawDistance
    };
  }
}
