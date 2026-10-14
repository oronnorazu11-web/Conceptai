import React from 'react';

interface ConceptAILogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'badge';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export const ConceptAILogo: React.FC<ConceptAILogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animate = true,
}) => {
  // Dimensions
  const dimensions = {
    sm: { icon: 30, textTitle: 'text-base', textSub: 'text-xs', gap: 'gap-2' },
    md: { icon: 42, textTitle: 'text-lg', textSub: 'text-sm', gap: 'gap-2.5' },
    lg: { icon: 56, textTitle: 'text-2xl', textSub: 'text-base', gap: 'gap-3' },
    xl: { icon: 84, textTitle: 'text-4xl', textSub: 'text-xl', gap: 'gap-4' },
    badge: { icon: 160, textTitle: 'text-3xl', textSub: 'text-2xl', gap: 'gap-4' },
  }[size];

  if (size === 'badge') {
    // Standalone replica of the exact uploaded reference image badge
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center p-8 rounded-3xl bg-[#060b1c] border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.35)] overflow-hidden ${className}`}
        style={{
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.25), inset 0 0 40px rgba(6, 182, 212, 0.08)',
        }}
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-center gap-6">
          <LogoIcon width={130} height={130} animate={animate} />
          <div className="flex flex-col items-start leading-none select-none">
            <span className="text-cyan-100 font-medium tracking-tight text-3xl mb-1 text-shadow-sm font-['Plus_Jakarta_Sans']">
              Concept
            </span>
            <span className="text-5xl font-extrabold tracking-wider bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#2563eb] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.7)] font-['Plus_Jakarta_Sans']">
              AI
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      <LogoIcon
        width={dimensions.icon}
        height={dimensions.icon}
        animate={animate}
      />

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`${dimensions.textTitle} font-semibold tracking-tight text-white/95 text-shadow-sm font-['Plus_Jakarta_Sans']`}
            >
              Concept
            </span>
            <span
              className={`${dimensions.textTitle} font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] font-['Plus_Jakarta_Sans']`}
            >
              AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const LogoIcon: React.FC<{
  width?: number;
  height?: number;
  animate?: boolean;
  className?: string;
}> = ({ width = 42, height = 42, animate = true, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,229,255,0.45)]"
      >
        <defs>
          {/* Gradient for Outer C Ribbon */}
          <linearGradient id="cOuterGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Gradient for Inner C Swoosh */}
          <linearGradient id="cInnerGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer stylized C swoop */}
        <path
          d="M 125 35 
             C 75 35, 32 72, 32 120
             C 32 165, 75 195, 125 195
             C 142 195, 158 190, 168 182
             L 155 162
             C 146 168, 136 172, 122 172
             C 86 172, 54 148, 54 116
             C 54 78, 86 56, 124 56
             C 140 56, 154 62, 162 70
             L 174 50
             C 160 40, 144 35, 125 35 Z"
          fill="url(#cOuterGrad)"
        />

        {/* Secondary inner contour crescent layer */}
        <path
          d="M 130 46
             C 85 46, 48 80, 48 122
             C 48 160, 84 186, 124 186
             C 138 186, 149 182, 157 176
             C 148 170, 137 166, 122 166
             C 90 166, 68 144, 68 118
             C 68 86, 92 64, 126 64
             C 138 64, 148 68, 156 73
             C 149 60, 138 46, 130 46 Z"
          fill="url(#cInnerGrad)"
          opacity="0.85"
        />

        {/* Glowing Brain Network inside the C */}
        <g id="neuralBrain" filter="url(#neonGlow)">
          {/* Brain Profile Contour Silhouette */}
          <path
            d="M 98 84
               C 92 74, 82 72, 74 77
               C 66 74, 58 79, 56 86
               C 50 88, 47 96, 49 103
               C 46 110, 48 118, 54 122
               C 56 128, 62 133, 70 133
               C 74 137, 82 139, 88 135
               C 92 142, 98 144, 102 138
               L 104 145
               C 107 149, 114 146, 115 140
               C 119 135, 124 133, 126 126
               C 132 122, 134 114, 130 108
               C 134 100, 131 92, 124 88
               C 123 80, 115 76, 108 78
               C 103 76, 97 78, 98 84 Z"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Internal Cerebrum Division Line */}
          <path
            d="M 92 82
               C 88 95, 96 108, 92 122
               C 90 128, 96 134, 102 138"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Neural Synapse Lines */}
          <line x1="68" y1="92" x2="84" y2="88" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="84" y1="88" x2="108" y2="92" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="108" y1="92" x2="120" y2="102" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="68" y1="92" x2="62" y2="108" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="62" y1="108" x2="80" y2="114" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="80" y1="114" x2="98" y2="108" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="98" y1="108" x2="116" y2="118" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="80" y1="114" x2="74" y2="128" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />
          <line x1="98" y1="108" x2="106" y2="128" stroke="#38bdf8" strokeWidth="2.2" opacity="0.8" />

          {/* Brain Stem Synapse */}
          <line x1="106" y1="128" x2="108" y2="142" stroke="#00f2fe" strokeWidth="2.2" opacity="0.8" />

          {/* Neural Nodes (Bright glowing synaptic circles) */}
          <g filter="url(#nodeGlow)">
            <circle cx="68" cy="92" r="4.2" fill="#ffffff" stroke="#00f2fe" strokeWidth="2" />
            <circle cx="84" cy="88" r="4.8" fill="#ffffff" stroke="#00f2fe" strokeWidth="2.2" />
            <circle cx="108" cy="92" r="4.5" fill="#ffffff" stroke="#00f2fe" strokeWidth="2.2" />
            <circle cx="120" cy="102" r="4.2" fill="#ffffff" stroke="#00f2fe" strokeWidth="2" />
            <circle cx="62" cy="108" r="3.8" fill="#ffffff" stroke="#00f2fe" strokeWidth="1.8" />
            <circle cx="80" cy="114" r="5" fill="#ffffff" stroke="#00f2fe" strokeWidth="2.2">
              {animate && (
                <animate
                  attributeName="r"
                  values="4.5;5.8;4.5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle cx="98" cy="108" r="5.2" fill="#ffffff" stroke="#00f2fe" strokeWidth="2.5">
              {animate && (
                <animate
                  attributeName="r"
                  values="5;6.5;5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle cx="116" cy="118" r="4.2" fill="#ffffff" stroke="#00f2fe" strokeWidth="2" />
            <circle cx="74" cy="128" r="3.8" fill="#ffffff" stroke="#00f2fe" strokeWidth="1.8" />
            <circle cx="106" cy="128" r="4" fill="#ffffff" stroke="#00f2fe" strokeWidth="2" />
            <circle cx="108" cy="142" r="3.2" fill="#ffffff" stroke="#00f2fe" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};
