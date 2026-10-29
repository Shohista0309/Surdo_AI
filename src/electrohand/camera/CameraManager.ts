import { CameraStatus, CameraErrorDetails } from '../types';

export class CameraManager {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private status: CameraStatus = 'idle';
  private onStatusChange?: (status: CameraStatus, error?: CameraErrorDetails) => void;

  constructor(onStatusChange?: (status: CameraStatus, error?: CameraErrorDetails) => void) {
    this.onStatusChange = onStatusChange;
  }

  public getStatus(): CameraStatus {
    return this.status;
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  /**
   * Request webcam access and attach to video element
   */
  public async startCamera(videoElement: HTMLVideoElement): Promise<boolean> {
    this.videoElement = videoElement;
    this.setStatus('starting');

    // First stop any existing stream
    this.stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NOT_SUPPORTED');
      }

      // Constraints tuned for low latency, smooth frame rate for tracking
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = stream;

      videoElement.srcObject = stream;
      videoElement.playsInline = true;
      videoElement.muted = true;

      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => {
          videoElement.removeEventListener('loadedmetadata', onLoaded);
          videoElement.play().then(() => resolve()).catch(reject);
        };

        if (videoElement.readyState >= 2) {
          videoElement.play().then(() => resolve()).catch(reject);
        } else {
          videoElement.addEventListener('loadedmetadata', onLoaded);
        }
      });

      this.setStatus('active');
      return true;
    } catch (err: unknown) {
      console.error('[ElectroHand Camera Error]:', err);
      const errorDetails = this.parseCameraError(err);
      this.setStatus('error', errorDetails);
      this.stopCamera();
      return false;
    }
  }

  /**
   * Cleanly stop all tracks and disconnect video element
   */
  public stopCamera(): void {
    if (this.stream) {
      try {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      } catch (e) {
        console.warn('Error stopping camera tracks:', e);
      }
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }

    if (this.status !== 'error') {
      this.setStatus('stopped');
    }
  }

  private setStatus(status: CameraStatus, error?: CameraErrorDetails) {
    this.status = status;
    if (this.onStatusChange) {
      this.onStatusChange(status, error);
    }
  }

  private parseCameraError(err: unknown): CameraErrorDetails {
    const error = err as { name?: string; message?: string };
    const name = error?.name || '';

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        titleUz: 'Kameraga ruxsat berilmadi',
        messageUz: 'Veb-kameradan foydalanish uchun brauzer manzil qatoridagi qulf belgisini bosing va kameraga ruxsat bering.',
        canRetry: true
      };
    }

    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        titleUz: 'Kamera topilmadi',
        messageUz: 'Qurilmangizga veb-kamera ulanmagan yoki u boshqa dastur tomonidan band qilingan. Zaxira sifatida sichqoncha rejimini yoqishingiz mumkin.',
        canRetry: true
      };
    }

    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return {
        titleUz: 'Kamera band yoki ishlamayapti',
        messageUz: 'Boshqa dastur (masalan Zoom, Telegram yoki boshqa vkladka) veb-kameradan foydalanmoqda. Iltimos, uni yopib qayta urinib ko‘ring.',
        canRetry: true
      };
    }

    if (name === 'OverconstrainedError') {
      return {
        titleUz: 'Kamera mos kelmadi',
        messageUz: 'Kamera sozlangan o‘lchamlarni qo‘llab-quvvatlamadi. Iltimos, qayta urinib ko‘ring.',
        canRetry: true
      };
    }

    return {
      titleUz: 'Kamera xatoligi yuz berdi',
      messageUz: 'Veb-kamerani ishga tushirib bo‘lmadi. Sichqoncha rejimidan foydalanishingiz yoki sahifani yangilashingiz mumkin.',
      canRetry: true
    };
  }
}
