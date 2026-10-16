// Web Speech API helper with fallback support

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionHelperState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError("Brauzeringiz ovozli kiritish (Web Speech API) imkoniyatini qo‘llab-quvvatlamaydi. Iltimos, matnni qo‘lda yozing.");
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = false;
  recognition.interimResults = true;
  // Try Uzbek language recognition first, fallback naturally
  recognition.lang = 'uz-UZ';

  recognition.onresult = (event: any) => {
    let currentText = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      currentText += event.results[i][0].transcript;
    }
    onResult(currentText);
  };

  recognition.onerror = (event: any) => {
    let msg = "Ovozni aniqlashda xatolik yuz berdi.";
    if (event.error === 'not-allowed') {
      msg = "Mikrofon ruxsati berilmadi. Brauzer sozlamalaridan mikrofonga ruxsat bering.";
    } else if (event.error === 'no-speech') {
      msg = "Hech qanday ovoz eshitilmadi. Qaytadan urinib ko‘ring.";
    }
    onError(msg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
