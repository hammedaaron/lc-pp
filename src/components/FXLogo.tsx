import React from 'react';

interface CryptoSLLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withText?: boolean;
}

export const CryptoSLLogo: React.FC<CryptoSLLogoProps> = ({
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
        className={`${dimensionMap[size]} rounded-[22%] bg-black flex items-center justify-center p-[8%] relative overflow-hidden shadow-xs ring-1 ring-white/20`}
        style={{
          boxShadow: '0 2px 8px -1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.25)',
        }}
        title="Crypto SL"
        aria-label="Crypto SL Logo"
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
            <linearGradient id="cslSilverBright" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="80%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            <linearGradient id="cslSilverSheen" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* C Monogram */}
          <path
            d="M 181 130 L 115 130 L 81 164 L 81 336 L 115 370 L 181 370 L 171 326 L 135 326 L 125 316 L 125 184 L 135 174 L 171 174 Z"
            fill="url(#cslSilverBright)"
          />
          <path d="M 181 130 L 115 130 L 81 164 L 92 164 L 122 138 L 181 138 Z" fill="#FFFFFF" opacity="0.9" />

          {/* S Monogram */}
          <path
            d="M 216 130 L 296 130 L 306 140 L 306 208 L 296 218 L 238 236 L 230 244 L 230 290 L 240 300 L 296 300 L 306 310 L 306 356 L 292 370 L 216 370 L 206 360 L 206 292 L 216 282 L 274 264 L 282 256 L 282 210 L 272 200 L 216 200 L 206 190 L 206 144 Z"
            fill="url(#cslSilverSheen)"
          />

          {/* L Monogram */}
          <path
            d="M 331 130 L 375 130 L 375 326 L 431 326 L 421 370 L 345 370 L 331 356 Z"
            fill="url(#cslSilverBright)"
          />

          {/* Base coordinate line */}
          <rect x="81" y="400" width="350" height="7" rx="3.5" fill="url(#cslSilverBright)" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight font-sans text-neutral-900 dark:text-white ${textMap[size]}`}>
            Crypto <span className="font-semibold text-neutral-500 dark:text-neutral-400">SL</span>
          </span>
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const FXLogo = CryptoSLLogo;

