import React, { useState } from 'react';

interface CompanyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  textDark?: boolean;
  variant?: 'image' | 'vector';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textDark = false,
  variant = 'image',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: { icon: 'w-6 h-6', textTitle: 'text-xs', textSub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', textTitle: 'text-sm', textSub: 'text-[10px]' },
    md: { icon: 'w-11 h-11', textTitle: 'text-base', textSub: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', textTitle: 'text-lg sm:text-xl', textSub: 'text-xs' },
    xl: { icon: 'w-20 h-20', textTitle: 'text-2xl', textSub: 'text-sm' },
    '2xl': { icon: 'w-28 h-28', textTitle: 'text-3xl', textSub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  // Pure SVG vector version of the Steel Man Force Security insignia
  const VectorLogo = (
    <svg
      viewBox="0 0 200 200"
      className={`${currentSize.icon} shrink-0 drop-shadow-md select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Steel Man Force Security Logo"
    >
      <defs>
        {/* Shield split gradients */}
        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="swordBlade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Top Arched Text: STEEL MAN */}
      <path id="curveTop" d="M 45 42 Q 100 22 155 42" fill="none" stroke="none" />
      <text fill="#1E3A8A" fontSize="17" fontWeight="900" letterSpacing="1" textAnchor="middle">
        <textPath href="#curveTop" startOffset="50%">
          STEEL MAN
        </textPath>
      </text>

      {/* Left Angled Text: FORCE */}
      <text
        x="38"
        y="125"
        transform="rotate(-55 38 125)"
        fill="#1E3A8A"
        fontSize="14"
        fontWeight="900"
        letterSpacing="1.5"
      >
        FORCE
      </text>

      {/* Right Angled Text: SECURITY */}
      <text
        x="152"
        y="95"
        transform="rotate(55 152 95)"
        fill="#1E3A8A"
        fontSize="13.5"
        fontWeight="900"
        letterSpacing="1.2"
      >
        SECURITY
      </text>

      {/* Crossed Swords Behind Shield */}
      {/* Sword 1 (Top Left to Bottom Right) */}
      <g>
        {/* Blade Top Left */}
        <polygon points="35,55 42,62 68,90 60,98" fill="url(#swordBlade)" />
        <polygon points="35,55 32,58 58,87" fill="#1D4ED8" />
        {/* Hilt Bottom Right */}
        <line x1="130" y1="140" x2="155" y2="165" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />
        {/* Crossguard */}
        <line x1="126" y1="152" x2="142" y2="136" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="square" />
        {/* Pommel */}
        <circle cx="157" cy="167" r="4.5" fill="#1E3A8A" />
      </g>

      {/* Sword 2 (Top Right to Bottom Left) */}
      <g>
        {/* Blade Top Right */}
        <polygon points="165,55 158,62 132,90 140,98" fill="url(#swordBlade)" />
        <polygon points="165,55 168,58 142,87" fill="#1D4ED8" />
        {/* Hilt Bottom Left */}
        <line x1="70" y1="140" x2="45" y2="165" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />
        {/* Crossguard */}
        <line x1="58" y1="136" x2="74" y2="152" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="square" />
        {/* Pommel */}
        <circle cx="43" cy="167" r="4.5" fill="#1E3A8A" />
      </g>

      {/* Main Shield Outline with Crenellations (Castle Battlement Top) */}
      {/* Left Shield Half (Yellow) */}
      <path
        d="M 100 52 
           L 70 52 L 70 58 L 60 58 L 60 52 L 48 52
           L 44 85 Q 44 135 100 162
           L 100 52 Z"
        fill="url(#shieldGold)"
        stroke="#1E3A8A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right Shield Half (Blue) */}
      <path
        d="M 100 52 
           L 130 52 L 130 58 L 140 58 L 140 52 L 152 52
           L 156 85 Q 156 135 100 162
           L 100 52 Z"
        fill="url(#shieldBlue)"
        stroke="#1E3A8A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Inner Shield Divider Line */}
      <line x1="100" y1="52" x2="100" y2="162" stroke="#1E3A8A" strokeWidth="2.5" />

      {/* Muscular Steel Man Guard Bodyguard Figure */}
      <g id="steelManFigure">
        {/* Head & Neck */}
        <ellipse cx="100" cy="72" rx="10.5" ry="12.5" fill="#D99B66" stroke="#9A5826" strokeWidth="1" />
        {/* Strong Jawline / Beard Goatee */}
        <path d="M 94 77 Q 100 84 106 77 Q 100 81 94 77 Z" fill="#1F2937" />
        <ellipse cx="100" cy="79" rx="2" ry="1" fill="#111827" />
        {/* Sunglasses */}
        <path d="M 92 68 L 108 68 L 107 72 L 93 72 Z" fill="#0F172A" />
        {/* Security Earpiece / Mic */}
        <path d="M 107 72 Q 111 76 108 79" stroke="#0F172A" strokeWidth="1.2" fill="none" />
        <circle cx="108" cy="79" r="1.5" fill="#0F172A" />

        {/* Muscular Traps & Torso (Black T-Shirt) */}
        <path
          d="M 72 108
             Q 82 86 94 83
             L 106 83
             Q 118 86 128 108
             L 125 116
             L 75 116 Z"
          fill="#18181B"
          stroke="#09090B"
          strokeWidth="1.5"
        />

        {/* Massive Muscular Arms (Folded / Crossed) */}
        {/* Left Shoulder & Bicep */}
        <path
          d="M 68 110
             Q 58 122 72 135
             Q 85 142 102 136
             Q 92 125 76 118 Z"
          fill="#D99B66"
          stroke="#8A4A1C"
          strokeWidth="1.2"
        />
        {/* Right Shoulder & Forearm Crossing */}
        <path
          d="M 132 110
             Q 142 122 128 135
             Q 115 142 98 136
             Q 108 125 124 118 Z"
          fill="#CCA070"
          stroke="#8A4A1C"
          strokeWidth="1.2"
        />
        {/* Forearm Details & Muscle Definition */}
        <path
          d="M 75 125
             C 85 130 115 130 125 125
             C 115 138 85 138 75 125 Z"
          fill="#BF8553"
          stroke="#7A3D14"
          strokeWidth="1"
        />
      </g>
    </svg>
  );

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon} ${className}`}>
        {/* We use the exact authentic logo image uploaded by user */}
        {!imgError && variant === 'image' ? (
          <img
            src="/logo.png"
            alt="Steel Man Force Security Logo"
            className="w-full h-full object-contain rounded-md drop-shadow-sm select-none"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          VectorLogo
        )}
      </div>

      {showText && (
        <div className="flex flex-col select-none leading-none">
          <span
            className={`font-black tracking-tight leading-tight ${currentSize.textTitle} ${
              textDark ? 'text-slate-900' : 'text-white'
            }`}
          >
            STEEL MEN
          </span>
          <span
            className={`font-extrabold uppercase tracking-widest ${currentSize.textSub} ${
              textDark ? 'text-blue-700' : 'text-blue-400'
            }`}
          >
            Security Force
          </span>
        </div>
      )}
    </div>
  );
};
