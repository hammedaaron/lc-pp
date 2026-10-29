import React from 'react';

interface FXLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withText?: boolean;
}

export const FXLogo: React.FC<FXLogoProps> = ({
  size = 'md',
  className = '',
  withText = false,
}) => {
  const dimensionMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Black squircle container with subtle silver rim */}
      <div
        className={`${dimensionMap[size]} rounded-[22%] bg-black flex items-center justify-center p-[10%] relative overflow-hidden shadow-xs ring-1 ring-white/20`}
        style={{
          boxShadow: '0 2px 8px -1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
        }}
        title="FX Position Planner"
        aria-label="FX Logo"
      >
        {/* Subtle inner metallic specular highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

        <svg
          viewBox="0 0 512 512"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fxSilverBright" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="80%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            <linearGradient id="fxSilverSheen" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* F Monogram */}
          <path
            d="M 96 128 L 238 128 L 220 174 L 150 174 L 150 232 L 214 232 L 200 274 L 150 274 L 150 384 L 96 384 Z"
            fill="url(#fxSilverBright)"
          />

          {/* F top bevel highlight */}
          <path d="M 96 128 L 238 128 L 232 134 L 102 134 Z" fill="#FFFFFF" opacity="0.95" />

          {/* X Monogram Backward Stroke */}
          <path d="M 398 128 L 448 128 L 298 384 L 248 384 Z" fill="url(#fxSilverSheen)" />

          {/* X Monogram Forward Stroke */}
          <path
            d="M 252 128 L 302 128 L 350 228 L 398 128 L 448 128 L 376 266 L 452 384 L 402 384 L 350 294 L 298 384 L 248 384 L 326 256 Z"
            fill="url(#fxSilverBright)"
          />

          {/* Precision base accent */}
          <rect x="96" y="404" width="356" height="6" rx="3" fill="url(#fxSilverBright)" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight font-sans text-neutral-900 dark:text-white ${textMap[size]}`}>
            FX <span className="font-normal text-neutral-500 dark:text-neutral-400">PLANNER</span>
          </span>
        </div>
      )}
    </div>
  );
};
