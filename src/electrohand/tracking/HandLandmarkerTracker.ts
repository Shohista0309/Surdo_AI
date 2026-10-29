import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { GestureDetector } from './GestureDetector';
import { GestureDetectionResult, HandLandmarkPoint } from '../types';

export class HandLandmarkerTracker {
  private handLandmarker: HandLandmarker | null = null;
  private gestureDetector: GestureDetector;
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private lastVideoTime: number = -1;
  private onResultCallback?: (result: GestureDetectionResult) => void;
  private initPromise: Promise<boolean> | null = null;

  constructor(onResult?: (result: GestureDetectionResult) => void) {
    this.gestureDetector = new GestureDetector();
    this.onResultCallback = onResult;
  }

  public getGestureDetector(): GestureDetector {
    return this.gestureDetector;
  }

  public isReady(): boolean {
    return this.handLandmarker !== null;
  }

  /**
   * Initializes the MediaPipe HandLandmarker using local assets with CDN fallback
   */
  public async initialize(): Promise<boolean> {
    if (this.handLandmarker) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const origin = window.location.origin;

        // 1. Resolve WASM assets (local first, then CDN fallback)
        let vision;
        try {
          vision = await FilesetResolver.forVisionTasks(`${origin}/mediapipe/wasm`);
        } catch (e) {
          console.warn('Local WASM loading failed, falling back to CDN:', e);
          vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
        }

        // 2. Load model (local GPU -> local CPU -> CDN fallback)
        try {
          this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `${origin}/models/hand_landmarker.task`,
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
        } catch (localGpuErr) {
          console.warn('Local GPU model loading failed, trying CPU fallback:', localGpuErr);
          try {
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: `${origin}/models/hand_landmarker.task`,
                delegate: 'CPU'
              },
              runningMode: 'VIDEO',
              numHands: 1
            });
          } catch (localCpuErr) {
            console.warn('Local model loading failed, falling back to CDN model:', localCpuErr);
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'GPU'
              },
              runningMode: 'VIDEO',
              numHands: 1
            });
          }
        }

        return true;
      } catch (err) {
        console.error('[ElectroHand] Failed to initialize HandLandmarker:', err);
        this.initPromise = null;
        return false;
      }
    })();

    return this.initPromise;
  }

  /**
   * Start processing video frames and rendering overlay
   */
  public start(videoElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement | null) {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;

      if (videoElement.readyState >= 2 && this.handLandmarker) {
        if (videoElement.currentTime !== this.lastVideoTime) {
          this.lastVideoTime = videoElement.currentTime;

          try {
            const results = this.handLandmarker.detectForVideo(videoElement, performance.now());
            
            let landmarks: HandLandmarkPoint[] | null = null;
            if (results.landmarks && results.landmarks.length > 0) {
              landmarks = results.landmarks[0] as HandLandmarkPoint[];
            }

            const gestureResult = this.gestureDetector.analyze(landmarks);

            // Draw skeleton & pinch effects on overlay canvas if provided
            if (canvasElement) {
              this.drawSkeleton(canvasElement, videoElement, landmarks, gestureResult);
            }

            if (this.onResultCallback) {
              this.onResultCallback(gestureResult);
            }
          } catch (err) {
            console.warn('[ElectroHand] Hand detection frame skipped:', err);
          }
        }
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  /**
   * Stop detection loop and reset
   */
  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.gestureDetector.resetFilter();
    this.lastVideoTime = -1;
  }

  /**
   * Clean up WebGL resources
   */
  public close() {
    this.stop();
    if (this.handLandmarker) {
      try {
        this.handLandmarker.close();
      } catch (e) {
        console.warn(e);
      }
      this.handLandmarker = null;
    }
  }

  /**
   * Draw high-tech neon hand skeleton with pinch focus reticle
   */
  private drawSkeleton(
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    landmarks: HandLandmarkPoint[] | null,
    gesture: GestureDetectionResult
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (!landmarks || landmarks.length < 21) {
      return;
    }

    // Mirror horizontally so user looks like a mirror
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);

    // Standard hand skeleton connections
    const CONNECTIONS = [
      // Thumb
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Middle
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Ring
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Pinky
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Palm base
      [5, 9], [9, 13], [13, 17]
    ];

    // 1. Draw bones (cyan glow)
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;

    CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      ctx.beginPath();
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    });

    // 2. Highlight pinch connection between Thumb Tip (4) and Index Tip (8)
    const thumb = landmarks[4];
    const index = landmarks[8];
    ctx.beginPath();
    ctx.moveTo(thumb.x * w, thumb.y * h);
    ctx.lineTo(index.x * w, index.y * h);
    if (gesture.isPinching) {
      ctx.strokeStyle = '#10b981'; // Green when pinched
      ctx.lineWidth = 4;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
    } else {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)'; // Amber when open
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
    }
    ctx.stroke();

    // 3. Draw joint dots
    landmarks.forEach((p, idx) => {
      ctx.beginPath();
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      const isPinchTip = idx === 4 || idx === 8;
      const radius = isPinchTip ? 6 : isTip ? 4.5 : 3.5;

      ctx.arc(p.x * w, p.y * h, radius, 0, Math.PI * 2);

      if (isPinchTip) {
        ctx.fillStyle = gesture.isPinching ? '#10b981' : '#00f0ff';
      } else {
        ctx.fillStyle = '#38bdf8';
      }
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 4. Draw pinch reticle at midpoint
    const midX = (thumb.x + index.x) / 2;
    const midY = (thumb.y + index.y) / 2;
    ctx.beginPath();
    ctx.arc(midX * w, midY * h, gesture.isPinching ? 12 : 8, 0, Math.PI * 2);
    ctx.strokeStyle = gesture.isPinching ? '#10b981' : '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (gesture.isPinching) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.fill();
    }

    ctx.restore();
  }
}
