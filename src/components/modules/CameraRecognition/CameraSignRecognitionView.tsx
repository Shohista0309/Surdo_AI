import React, { useState, useEffect, useRef } from 'react';
import { Camera as CameraIcon, CameraOff, Volume2, Copy, Check, RotateCcw, AlertCircle, ShieldCheck, Sparkles, CheckCircle2, Eye, Info } from 'lucide-react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { classifyHandGesture, GestureStabilizer, RecognizedGestureResult, speakTextUzbek, HandLandmark } from '../../../utils/handGestureRecognizer';
import { Badge } from '../../common/Badge';

export const CameraSignRecognitionView: React.FC = () => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Recognition state
  const [currentGesture, setCurrentGesture] = useState<RecognizedGestureResult | null>(null);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [history, setHistory] = useState<{ text: string; time: string; confidence: number }[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  // Refs for media elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraInstanceRef = useRef<Camera | null>(null);
  const handsInstanceRef = useRef<Hands | null>(null);
  const stabilizerRef = useRef<GestureStabilizer>(new GestureStabilizer(6));

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setCameraLoading(true);

    try {
      // 1. Explicit camera permission check
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      // Stop test stream, pass element to MediaPipe
      stream.getTracks().forEach((t) => t.stop());

      if (!videoRef.current) {
        throw new Error("Video elementi topilmadi");
      }

      // 2. Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.6
      });

      hands.onResults(onHandResults);
      handsInstanceRef.current = hands;

      // 3. Initialize MediaPipe Camera
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsInstanceRef.current) {
            await handsInstanceRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraInstanceRef.current = camera;
      setCameraActive(true);
      setCameraLoading(false);
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      let errorMsg = "Kamerani ishga tushirib bo‘lmadi.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = "Kameraga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan kameraga ruxsat bering.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = "Qurilmangizda kamera topilmadi.";
      } else {
        errorMsg = `Kamera xatoligi: ${err.message || 'Noma’lum xatolik'}`;
      }
      setCameraError(errorMsg);
      setCameraLoading(false);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch (e) {
        console.warn('Error stopping camera:', e);
      }
      cameraInstanceRef.current = null;
    }

    if (handsInstanceRef.current) {
      try {
        handsInstanceRef.current.close();
      } catch (e) {
        console.warn('Error closing hands:', e);
      }
      handsInstanceRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    stabilizerRef.current.reset();
    setCameraActive(false);
    setCameraLoading(false);
    setHandDetected(false);
  };

  // Process MediaPipe results
  const onHandResults = (results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const rawLandmarks = results.multiHandLandmarks[0] as HandLandmark[];

      // Draw hand skeleton overlay
      if (showOverlay) {
        drawHandLandmarks(ctx, rawLandmarks, canvas.width, canvas.height);
      }

      // Classify gesture
      const detected = classifyHandGesture(rawLandmarks);
      const stabilized = stabilizerRef.current.addFrame(detected);

      if (stabilized) {
        setCurrentGesture(stabilized);
        setRecognizedText(stabilized.speakingPhrase);

        // Add to history if unique or new
        setHistory((prev) => {
          const last = prev[0];
          if (!last || last.text !== stabilized.nameUz) {
            const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return [{ text: stabilized.nameUz, time: timeStr, confidence: Math.round(stabilized.confidence * 100) }, ...prev.slice(0, 4)];
          }
          return prev;
        });
      }
    } else {
      setHandDetected(false);
      stabilizerRef.current.addFrame(null);
    }

    ctx.restore();
  };

  // Draw 21-point hand skeleton with thematic colors
  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: HandLandmark[], width: number, height: number) => {
    // MediaPipe Hand connections topology
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm Base
    ];

    // Draw bones
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#2F6B4F'; // Primary green
    ctx.lineCap = 'round';

    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      // Mirror X for selfie camera view
      ctx.moveTo((1 - p1.x) * width, p1.y * height);
      ctx.lineTo((1 - p2.x) * width, p2.y * height);
      ctx.stroke();
    });

    // Draw joints
    landmarks.forEach((lm, idx) => {
      const x = (1 - lm.x) * width;
      const y = lm.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(idx);

      ctx.beginPath();
      ctx.arc(x, y, isTip ? 6.5 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = isTip ? '#E9DDC9' : '#173F35'; // Fingertip highlight
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    });
  };

  const handleSpeak = () => {
    if (!recognizedText) return;
    setIsSpeaking(true);
    speakTextUzbek(recognizedText);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const handleCopy = () => {
    if (!recognizedText) return;
    navigator.clipboard.writeText(recognizedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setRecognizedText('');
    setCurrentGesture(null);
    stabilizerRef.current.reset();
  };

  // Supported gesture reference items
  const supportedGesturesList = [
    { name: 'Yaxshi (Ajoyib)', pose: 'Bosh barmoq tik yuqorida (Thumbs-up)', status: 'Haqiqiy aniqlash' },
    { name: 'Salom / Xayr', pose: 'Barcha 5 barmoq ochiq, qo‘l ko‘tarilgan', status: 'Haqiqiy aniqlash' },
    { name: 'Mehr / Sevaman', pose: 'Bosh, ko‘rsatkich va jimjiloq ochiq (ILY)', status: 'Haqiqiy aniqlash' },
    { name: 'Daktil "V" / 2 soni', pose: 'Ko‘rsatkich va o‘rta barmoq V shaklida', status: 'Haqiqiy aniqlash' },
    { name: '1 soni (Bir)', pose: 'Faqat bitta ko‘rsatkich barmoq tik', status: 'Haqiqiy aniqlash' },
    { name: 'Daktil "B" / 4 soni', pose: '4 ta barmoq tik, bosh barmoq kaftda', status: 'Haqiqiy aniqlash' },
    { name: 'Daktil "A" harfi', pose: 'Mushtlangan qo‘l, bosh barmoq yonida', status: 'Haqiqiy aniqlash' },
    { name: 'Assalomu alaykum', pose: 'Ko‘krak sohasida ochiq tekis kaft', status: 'Haqiqiy aniqlash' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="max-w-3xl">
          <Badge variant="sage" size="md" className="mb-3">
            Kompyuter Ko‘rishi (Computer Vision)
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
            Kamera Orqali Imo-ishorani Aniqlash (Sign-to-Speech)
          </h1>
          <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
            Qurilmangiz kamerasini yoqing va qo‘lingiz bilan o‘zbek imo-ishorasini ko‘rsating. Sun’iy intellekt qo‘l bo‘g‘inlarini (21 nuqta) real vaqtda kuzatib, imo-ishorani o‘zbekcha matnga va ovozga aylantiradi.
          </p>
        </div>

        {/* Privacy & Technical Disclosure */}
        <div className="mt-6 pt-6 border-t border-surdo-beige/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-bold">100% Mahalliy Maxfiylik (On-Device):</strong>
              Kamerangiz tasviri hech qayerga yozilmaydi yoki serverlarga yuborilmaydi. Hamma ishlov to‘liq brauzeringiz ichida lokal bajariladi.
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-950">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-bold">Aniqlik chegaralari:</strong>
              Ushbu MVP 21 ta nuqta geometriyasi asosida barmoq konfiguratsiyalarini taniydi. Murakkab harakatli gaplar uchun chuqur temporal modellar tayyorlanmoqda.
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Camera Viewport & Recognition Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 border-2 border-surdo-beige shadow-elevated aspect-[4/3] flex items-center justify-center">
            {/* Raw Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />

            {/* Canvas for Hand Tracking Landmarks */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />

            {/* Offline / Inactive State View */}
            {!cameraActive && !cameraLoading && (
              <div className="relative z-20 text-center p-8 max-w-sm text-surdo-cream space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-surdo-sage">
                  <CameraIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Kamera hozircha o‘chiq
                  </h3>
                  <p className="text-xs text-surdo-cream/70 mt-1">
                    Imo-ishoralarni tahlil qilish uchun "Kamerani yoqish" tugmasini bosing va ruxsat bering.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-lg transition-all"
                >
                  Kamerani yoqish
                </button>
              </div>
            )}

            {/* Loading State Spinner */}
            {cameraLoading && (
              <div className="relative z-20 text-center p-6 text-surdo-cream space-y-3">
                <div className="w-12 h-12 border-4 border-surdo-sage/20 border-t-surdo-sage rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold">Kamera va MediaPipe modeli yuklanmoqda...</p>
              </div>
            )}

            {/* Active Status Badges Overlay */}
            {cameraActive && (
              <>
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surdo-darkest/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-surdo-cream text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${handDetected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="font-semibold">
                    {handDetected ? 'Qo‘l kadrda aniqlandi' : 'Qo‘lingizni kameraga ko‘rsating'}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all ${
                      showOverlay
                        ? 'bg-surdo-forest/80 text-surdo-cream border-emerald-400/30'
                        : 'bg-black/50 text-white/70 border-white/10'
                    }`}
                  >
                    {showOverlay ? 'To‘r: Yoqilgan' : 'To‘r: O‘chiq'}
                  </button>
                </div>
              </>
            )}

            {/* Error Notification */}
            {cameraError && (
              <div className="absolute inset-0 z-30 bg-surdo-darkest/90 p-6 flex flex-col items-center justify-center text-center text-surdo-cream">
                <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Xatolik</h4>
                <p className="text-xs text-surdo-cream/80 max-w-xs mb-4">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-5 py-2 rounded-xl bg-white text-surdo-forest text-xs font-bold"
                >
                  Qaytadan urinish
                </button>
              </div>
            )}
          </div>

          {/* Camera Controls Bar */}
          <div className="p-4 bg-white rounded-2xl border border-surdo-beige flex flex-wrap items-center justify-between gap-3 shadow-soft">
            <div className="flex items-center gap-2">
              {cameraActive ? (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Kamerani to‘xtatish</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Kamerani yoqish</span>
                </button>
              )}

              <button
                onClick={handleClear}
                className="p-2.5 border border-surdo-beige text-surdo-forest hover:bg-surdo-sand rounded-xl transition-colors"
                title="Natijani tozalash"
                aria-label="Natijani tozalash"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-surdo-brown font-medium">
              <span>MediaPipe Hands (21 nuqta)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Recognition Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Result Card */}
          <div className="bg-white p-6 rounded-3xl border border-surdo-beige shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">
                Aniqlangan Imo-ishora
              </span>
              {currentGesture && (
                <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
                  Ishonchlilik: {Math.round(currentGesture.confidence * 100)}%
                </Badge>
              )}
            </div>

            {/* Big Output Display */}
            <div className="p-5 bg-surdo-sand/30 rounded-2xl border border-surdo-beige min-h-[120px] flex flex-col justify-center">
              {currentGesture ? (
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-surdo-forest font-display tracking-tight animate-in fade-in">
                    {currentGesture.nameUz}
                  </div>
                  <p className="text-xs text-surdo-cocoa mt-1.5 leading-relaxed">
                    {currentGesture.description}
                  </p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <span className="text-xs text-stone-400 italic">
                    {cameraActive
                      ? 'Imo-ishorani ko‘rsating (masalan: bosh barmoq yuqoriga yoki ochiq kaft)...'
                      : 'Kamerani yoqing va qo‘lingizni ko‘rsating'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: Speak & Copy */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSpeak}
                disabled={!recognizedText}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                  recognizedText
                    ? isSpeaking
                      ? 'bg-amber-600 text-white'
                      : 'bg-surdo-forest hover:bg-surdo-green text-surdo-cream'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                aria-label="Ovoz chiqarib aytish"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Aytilmoqda...' : 'Ovoz chiqarish'}</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!recognizedText}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-surdo-forest text-surdo-forest hover:bg-surdo-sand font-bold text-xs sm:text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Nusxa olish"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Nusxa olindi' : 'Nusxalash'}</span>
              </button>
            </div>
          </div>

          {/* Supported Expressions Reference Guide */}
          <div className="bg-white p-6 rounded-3xl border border-surdo-beige shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-surdo-forest font-display uppercase tracking-wider">
                Hozirda aniqlanuvchi iboralar
              </h3>
              <Badge variant="sage" size="sm">
                8 ta tasdiqlangan
              </Badge>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {supportedGesturesList.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surdo-sand/30 rounded-xl border border-surdo-beige/60 text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-surdo-forest text-xs">{g.name}</span>
                    <p className="text-[11px] text-surdo-brown mt-0.5">{g.pose}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold shrink-0">
                    Faol
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* History of Recognized Gestures */}
          {history.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-surdo-beige shadow-soft space-y-3">
              <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider block">
                Oxirgi aniqlanganlar tarixi:
              </span>
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surdo-sand/40 border border-surdo-beige">
                    <span className="font-bold text-surdo-darkest">{h.text}</span>
                    <div className="flex items-center gap-2 text-surdo-brown text-[11px]">
                      <span>{h.confidence}%</span>
                      <span>{h.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
