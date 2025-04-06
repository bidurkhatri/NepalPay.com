import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { motion } from 'framer-motion';

// Nepali cultural symbols and art patterns
const MANDALA_PATTERNS = [
  // Basic mandala pattern
  `M 0 0 C 0 -50 50 -50 50 0 C 50 50 0 50 0 0 Z`,
  // More complex mandala pattern
  `M 0 0 C 0 -25 25 -25 25 0 S 0 25 0 0 Z M 0 0 C 0 -50 50 -50 50 0 S 0 50 0 0 Z`,
  // Flower-like mandala pattern
  `M 0 0 C 0 -20 20 -20 20 0 S 0 20 0 0 Z M 0 0 C 20 0 20 20 0 20 S -20 0 0 0 Z M 0 0 C 0 20 -20 20 -20 0 S 0 -20 0 0 Z M 0 0 C -20 0 -20 -20 0 -20 S 20 0 0 0 Z`,
];

// Nepal map outline simplified path
const NEPAL_OUTLINE = `M 20 10 L 40 5 L 60 10 L 80 15 L 90 25 L 80 35 L 70 50 L 60 60 L 50 70 L 40 75 L 30 70 L 20 60 L 15 50 L 10 40 L 5 30 L 10 20 L 20 10 Z`;

interface NepaliWalletVisualizationProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showDetails?: boolean;
}

const NepaliWalletVisualization: React.FC<NepaliWalletVisualizationProps> = ({
  className = '',
  size = 'medium',
  animated = true,
  showDetails = true,
}) => {
  const { wallet, stats } = useWallet();
  const [hovered, setHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Determine size dimensions
  const dimensions = {
    small: { width: 200, height: 200 },
    medium: { width: 300, height: 300 },
    large: { width: 400, height: 400 },
  }[size];
  
  // Calculate balance percentage (for visualization intensity)
  const balanceValue = wallet ? parseFloat(wallet.balance.toString()) : 0;
  const balancePercentage = Math.min(Math.max(balanceValue / 10000, 0), 1); // Scale between 0 and 1
  
  // Animation effect for animated prop
  useEffect(() => {
    if (animated) {
      let animationFrame: number;
      let progress = 0;
      
      const animate = () => {
        progress += 0.005;
        if (progress > 1) progress = 0;
        setAnimationProgress(progress);
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [animated]);
  
  // Choose visualization style based on balance
  const getVisualizationStyle = () => {
    if (balanceValue <= 0) return 'empty';
    if (balanceValue < 1000) return 'low';
    if (balanceValue < 5000) return 'medium';
    return 'high';
  };
  
  const visualizationStyle = getVisualizationStyle();
  
  // Generate dynamic colors based on balance
  const generateColors = () => {
    // Low balance: Red/orange tones (traditional Nepali fabric colors)
    if (visualizationStyle === 'low') {
      return {
        primary: '#d14836',
        secondary: '#f39c44',
        accent: '#ffd700',
        background: 'rgba(209, 72, 54, 0.1)',
      };
    }
    
    // Medium balance: Gold/yellow tones (representative of prosperity)
    if (visualizationStyle === 'medium') {
      return {
        primary: '#ffd700',
        secondary: '#d4af37',
        accent: '#c29738',
        background: 'rgba(212, 175, 55, 0.1)',
      };
    }
    
    // High balance: Blue/turquoise (representing water and mountains)
    if (visualizationStyle === 'high') {
      return {
        primary: '#00a5b5',
        secondary: '#006d77',
        accent: '#61dafb',
        background: 'rgba(0, 165, 181, 0.1)',
      };
    }
    
    // Empty balance: Grey tones
    return {
      primary: '#708090',
      secondary: '#36454F',
      accent: '#A9A9A9',
      background: 'rgba(112, 128, 144, 0.1)',
    };
  };
  
  const colors = generateColors();
  
  // Generate mandala variation based on balance and animation
  const generateMandala = () => {
    // Select complexity based on balance
    const patternIndex = Math.min(
      Math.floor(balancePercentage * MANDALA_PATTERNS.length),
      MANDALA_PATTERNS.length - 1
    );
    
    const pattern = MANDALA_PATTERNS[patternIndex];
    
    // Number of repetitions based on balance
    const repetitions = Math.max(3, Math.floor(balancePercentage * 12));
    
    return (
      <>
        {Array.from({ length: repetitions }).map((_, i) => {
          const angle = (i / repetitions) * 360;
          const scale = 0.8 + (balancePercentage * 0.4);
          
          // Add pulse animation if animated
          const pulseScale = animated
            ? scale + Math.sin((animationProgress * Math.PI * 2) + (i / repetitions) * Math.PI) * 0.1
            : scale;
          
          return (
            <g
              key={i}
              transform={`rotate(${angle} ${dimensions.width / 2} ${dimensions.height / 2}) translate(${dimensions.width / 2} ${dimensions.height / 2}) scale(${pulseScale})`}
            >
              <path
                d={pattern}
                fill="none"
                stroke={i % 2 === 0 ? colors.primary : colors.secondary}
                strokeWidth={1 + balancePercentage * 2}
                opacity={0.7 + (i % 3) * 0.1}
              />
            </g>
          );
        })}
        
        {/* Center circle */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={10 + balancePercentage * 20}
          fill={colors.accent}
          opacity={0.8}
        />
      </>
    );
  };
  
  // Nepal map outline visualization
  const generateNepalMap = () => {
    return (
      <g transform={`translate(${dimensions.width / 2 - 50} ${dimensions.height / 2 - 40}) scale(${0.8 + balancePercentage * 0.5})`}>
        <path
          d={NEPAL_OUTLINE}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2 + balancePercentage * 3}
          opacity={0.8}
        />
        
        {/* Add mountain peaks */}
        <path
          d="M 30 40 L 40 20 L 50 40 M 50 45 L 60 25 L 70 45 M 15 30 L 25 15 L 35 30"
          fill="none"
          stroke={colors.secondary}
          strokeWidth={1 + balancePercentage * 2}
          opacity={0.7}
        />
        
        {/* Add a sun or moon symbol */}
        <circle
          cx={75}
          cy={25}
          r={5 + balancePercentage * 5}
          fill={colors.accent}
          opacity={animated ? 0.5 + Math.sin(animationProgress * Math.PI) * 0.3 : 0.8}
        />
      </g>
    );
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{ width: dimensions.width, height: dimensions.height, background: colors.background }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        {/* Background glow effect */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background glow */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={dimensions.width / 2 * (0.6 + balancePercentage * 0.4)}
          fill="url(#glow)"
          opacity={animated ? 0.5 + Math.sin(animationProgress * Math.PI * 2) * 0.3 : 0.8}
        />
        
        {/* Generate appropriate visualization based on style */}
        {visualizationStyle === 'empty' ? (
          <g transform={`translate(${dimensions.width / 2 - 30} ${dimensions.height / 2 - 30})`}>
            <path
              d="M 30 0 L 60 30 L 30 60 L 0 30 Z"
              fill="none"
              stroke={colors.primary}
              strokeWidth={2}
              opacity={0.6}
            />
            <text
              x="30"
              y="35"
              textAnchor="middle"
              fill={colors.primary}
              fontSize="10"
              fontWeight="bold"
            >
              Empty
            </text>
          </g>
        ) : (
          <>
            {/* Combine mandala and map for non-empty balances */}
            {generateMandala()}
            {generateNepalMap()}
          </>
        )}
      </svg>
      
      {showDetails && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: hovered ? 0 : 30, opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-bold">
            {wallet?.balance ? `NPR ${parseFloat(wallet.balance.toString()).toFixed(2)}` : 'NPR 0.00'}
          </h3>
          {hovered && (
            <div className="text-xs mt-1 grid grid-cols-2 gap-1">
              <div>
                <span className="text-gray-400">Income: </span>
                <span className="text-green-400">{stats.income}</span>
              </div>
              <div>
                <span className="text-gray-400">Expenses: </span>
                <span className="text-red-400">{stats.expenses}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NepaliWalletVisualization;