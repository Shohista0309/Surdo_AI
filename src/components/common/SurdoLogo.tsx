import React from 'react';

interface SurdoLogoIconProps {
  size?: number | string;
  className?: string;
  variant?: 'badge' | 'flat' | 'inverted' | 'cream';
  title?: string;
}

/**
 * SURDO AI Official Brand Icon: Two hands forming a heart silhouette.
 * Represents inclusive communication, human warmth, accessibility, and sign language.
 */
export const SurdoLogoIcon: React.FC<SurdoLogoIconProps> = ({
  size = 40,
  className = '',
  variant = 'badge',
  title = 'SURDO AI Logo'
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  if (variant === 'flat') {
    return (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform ${className}`}
        aria-label={title}
        role="img"
      >
        <title>{title}</title>
        <defs>
          {/* Gradient for left hand (Forest to Primary Green) */}
          <linearGradient id="leftHandGradFlat" x1="20%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#2F6B4F" />
            <stop offset="100%" stopColor="#173F35" />
          </linearGradient>
          {/* Gradient for right hand (Sage to Primary Green) */}
          <linearGradient id="rightHandGradFlat" x1="80%" y1="10%" x2="30%" y2="90%">
            <stop offset="0%" stopColor="#A9BDA6" />
            <stop offset="50%" stopColor="#2F6B4F" />
            <stop offset="100%" stopColor="#173F35" />
          </linearGradient>
          {/* Subtle soft shadow for organic hand overlap */}
          <filter id="handShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- LEFT HAND --- */}
        {/* Main curved hand and fingers forming left lobe of heart */}
        <path
          d="M 50 31 
             C 43 20, 29 15, 19 25 
             C 9 35, 8 50, 16 63 
             C 22 72, 33 80, 50 89 
             C 45 81, 39 74, 34 65 
             C 28 55, 29 44, 36 36 
             C 41 30, 46 31, 50 31 Z"
          fill="url(#leftHandGradFlat)"
        />

        {/* Left Thumb forming lower heart contour */}
        <path
          d="M 28 62
             C 32 68, 40 78, 50 89
             C 44 83, 38 74, 34 65
             C 32 63, 30 62, 28 62 Z"
          fill="#173F35"
        />

        {/* Left Hand Finger Separation Grooves (Index, Middle, Ring) */}
        <path
          d="M 24 23 C 28 27, 34 33, 37 39"
          stroke="#F7F3E9"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M 33 17 C 38 23, 43 29, 45 35"
          stroke="#F7F3E9"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* --- RIGHT HAND --- */}
        {/* Main curved hand and fingers forming right lobe of heart */}
        <path
          d="M 50 31 
             C 57 20, 71 15, 81 25 
             C 91 35, 92 50, 84 63 
             C 78 72, 67 80, 50 89 
             C 55 81, 61 74, 66 65 
             C 72 55, 71 44, 64 36 
             C 59 30, 54 31, 50 31 Z"
          fill="url(#rightHandGradFlat)"
          filter="url(#handShadow)"
        />

        {/* Right Thumb forming lower heart contour */}
        <path
          d="M 72 62
             C 68 68, 60 78, 50 89
             C 56 83, 62 74, 66 65
             C 68 63, 70 62, 72 62 Z"
          fill="#173F35"
        />

        {/* Right Hand Finger Separation Grooves */}
        <path
          d="M 76 23 C 72 27, 66 33, 63 39"
          stroke="#F7F3E9"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M 67 17 C 62 23, 57 29, 55 35"
          stroke="#F7F3E9"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Central Inner Heart Glow / Spark of Connection */}
        <circle cx="50" cy="52" r="3.5" fill="#E9DDC9" opacity="0.85" />
      </svg>
    );
  }

  // Default 'badge' variant: Enclosed in a rounded squircle container
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <defs>
        {/* Squircle Background Gradient */}
        <linearGradient id="badgeBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E4D41" />
          <stop offset="100%" stopColor="#13362E" />
        </linearGradient>

        {/* Left Hand Gradient */}
        <linearGradient id="leftHandGradBadge" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#F7F3E9" />
          <stop offset="60%" stopColor="#E9DDC9" />
          <stop offset="100%" stopColor="#A9BDA6" />
        </linearGradient>

        {/* Right Hand Gradient */}
        <linearGradient id="rightHandGradBadge" x1="85%" y1="15%" x2="15%" y2="85%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E9DDC9" />
          <stop offset="100%" stopColor="#A9BDA6" />
        </linearGradient>

        {/* Inner Heart Window Warm Fill */}
        <radialGradient id="innerHeartGlow" cx="50%" cy="52%" r="40%">
          <stop offset="0%" stopColor="#8A6346" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#173F35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="24"
        fill="url(#badgeBgGrad)"
        stroke="#2F6B4F"
        strokeWidth="1.5"
      />

      {/* Subtle Inner Ring */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="22"
        fill="none"
        stroke="#A9BDA6"
        strokeWidth="0.75"
        strokeOpacity="0.3"
      />

      {/* Inner Heart Radial Ambient */}
      <ellipse cx="50" cy="54" rx="20" ry="18" fill="url(#innerHeartGlow)" />

      {/* --- LEFT HAND --- */}
      <path
        d="M 50 31 
           C 42 20, 27 15, 18 26 
           C 9 37, 8 51, 17 64 
           C 24 74, 36 82, 50 90 
           C 45 82, 39 74, 34 65 
           C 28 55, 29 44, 37 36 
           C 42 31, 47 31, 50 31 Z"
        fill="url(#leftHandGradBadge)"
      />

      {/* Left Hand Finger Articulations */}
      <path
        d="M 23 24 C 27 28, 33 34, 36 40"
        stroke="#173F35"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <path
        d="M 33 18 C 38 23, 43 30, 45 36"
        stroke="#173F35"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      {/* Left Thumb Detail */}
      <path
        d="M 27 63 C 33 71, 41 80, 50 90 C 44 83, 38 73, 34 65 Z"
        fill="#8A6346"
        fillOpacity="0.7"
      />

      {/* --- RIGHT HAND --- */}
      <path
        d="M 50 31 
           C 58 20, 73 15, 82 26 
           C 91 37, 92 51, 83 64 
           C 76 74, 64 82, 50 90 
           C 55 82, 61 74, 66 65 
           C 72 55, 71 44, 63 36 
           C 58 31, 53 31, 50 31 Z"
        fill="url(#rightHandGradBadge)"
      />

      {/* Right Hand Finger Articulations */}
      <path
        d="M 77 24 C 73 28, 67 34, 64 40"
        stroke="#173F35"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <path
        d="M 67 18 C 62 23, 57 30, 55 36"
        stroke="#173F35"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      {/* Right Thumb Detail */}
      <path
        d="M 73 63 C 67 71, 59 80, 50 90 C 56 83, 62 73, 66 65 Z"
        fill="#8A6346"
        fillOpacity="0.7"
      />

      {/* Center Harmonizing Connection Spark */}
      <circle cx="50" cy="52" r="3" fill="#F7F3E9" />
      <circle cx="50" cy="52" r="1.5" fill="#8A6346" />
    </svg>
  );
};

interface SurdoLogoProps {
  size?: number | string;
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Full SURDO AI Logo & Wordmark Lockup Component
 */
export const SurdoLogo: React.FC<SurdoLogoProps> = ({
  size = 40,
  showWordmark = true,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <SurdoLogoIcon
        size={size}
        className="group-hover:scale-105 group-hover:shadow-md transition-all duration-200"
      />

      {showWordmark && (
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-surdo-forest font-display">
              SURDO
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-surdo-green text-surdo-cream font-bold tracking-wider">
              AI
            </span>
          </div>
          <p className="text-[10px] text-surdo-brown font-semibold tracking-wider uppercase hidden sm:block mt-0.5">
            Inklyuziv Ta’lim & Imo-ishora
          </p>
        </div>
      )}
    </div>
  );
};

export default SurdoLogo;
