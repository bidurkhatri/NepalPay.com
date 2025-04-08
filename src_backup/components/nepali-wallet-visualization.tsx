import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Info, Eye, EyeOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Size options
type VisualizationSize = 'small' | 'medium' | 'large';

// Theme options
type VisualizationTheme = 'mandala' | 'thangka' | 'himalaya' | 'modern';

// Define Nepali color palettes
const colorPalettes = {
  mandala: {
    primary: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'],
    secondary: ['#FF9F1C', '#FFBF69', '#CBF3F0', '#2EC4B6', '#A882DD'],
  },
  thangka: {
    primary: ['#990000', '#FFD700', '#03588C', '#F24C00', '#6B2737'],
    secondary: ['#B80C09', '#F7B538', '#6B2737', '#A682FF', '#5E6472'],
  },
  himalaya: {
    primary: ['#5D5C61', '#379683', '#7395AE', '#557A95', '#B1A296'],
    secondary: ['#B8F2E6', '#AED9E0', '#5E6472', '#8D8D92', '#6B2737'],
  },
  modern: {
    primary: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429'],
    secondary: ['#06D6A0', '#118AB2', '#073B4C', '#FFD166', '#EF476F'],
  },
};

// Help text for wallet visualization
const helpText = `
The NPT wallet visualization uses traditional Nepali art styles to represent your wallet balances:

- The center mandala represents your NPT balance, with more intricate patterns indicating higher balances.
- The outer border shows your BNB balance, with thicker lines indicating higher amounts.
- Colors change based on the ratio between your tokens - blues and greens for savings-focused, reds and golds for active trading.
- The animation speed indicates recent transaction activity.

This visualization follows sacred geometry principles found in traditional Nepali art and creates a unique pattern based on your personal wallet.
`;

const NepaliWalletVisualization = () => {
  const { balance, isConnected } = useWallet();
  
  // Visualization state
  const [size, setSize] = useState<VisualizationSize>('medium');
  const [theme, setTheme] = useState<VisualizationTheme>('mandala');
  const [animate, setAnimate] = useState<boolean>(true);
  const [hideBalances, setHideBalances] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  
  // Calculate dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small': return { width: 200, height: 200 };
      case 'medium': return { width: 300, height: 300 };
      case 'large': return { width: 400, height: 400 };
      default: return { width: 300, height: 300 };
    }
  };
  
  const dimensions = getDimensions();
  
  // Convert balance to visualization parameters
  const getVisualizationParams = () => {
    // Parse balances
    const nptBalance = parseFloat(balance.npt) || 0;
    const bnbBalance = parseFloat(balance.bnb) || 0;
    
    // Map balances to visualization parameters
    const segments = Math.min(Math.max(Math.floor(nptBalance / 100) + 3, 3), 12);
    const layers = Math.min(Math.max(Math.floor(nptBalance / 500) + 2, 2), 5);
    const borderWidth = Math.min(Math.max(bnbBalance * 2, 1), 10);
    const rotationSpeed = animate ? Math.min(Math.max(nptBalance / 1000, 0.5), 5) : 0;
    
    // Calculate color index based on balance ratio
    const ratio = nptBalance > 0 && bnbBalance > 0 ? nptBalance / (bnbBalance * 1000) : 0;
    const colorIndex = Math.min(Math.floor(ratio * 2), 4);
    
    return { segments, layers, borderWidth, rotationSpeed, colorIndex };
  };
  
  // Generate SVG for the visualization
  const generateSvg = () => {
    const { segments, layers, borderWidth, rotationSpeed, colorIndex } = getVisualizationParams();
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - borderWidth * 2;
    
    // Get colors based on theme
    const primaryColors = colorPalettes[theme].primary;
    const secondaryColors = colorPalettes[theme].secondary;
    
    // Generate mandala patterns
    let paths = [];
    let circles = [];
    
    // Create circles for each layer
    for (let layer = 0; layer < layers; layer++) {
      const radius = maxRadius * ((layer + 1) / layers);
      const color = primaryColors[layer % primaryColors.length];
      const secondaryColor = secondaryColors[layer % secondaryColors.length];
      
      // Add base circle
      circles.push(
        <circle 
          key={`circle-${layer}`}
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={borderWidth / (layer + 1)}
          opacity={0.7}
        />
      );
      
      // Add petal patterns
      for (let seg = 0; seg < segments; seg++) {
        const angle = (seg * 360) / segments;
        const radAngle = (angle * Math.PI) / 180;
        
        // Calculate points for petal
        const innerRadius = radius * 0.6;
        const outerRadius = radius * 0.9;
        const controlRadius = radius * 1.1;
        
        const startX = centerX + innerRadius * Math.cos(radAngle);
        const startY = centerY + innerRadius * Math.sin(radAngle);
        
        const endX = centerX + innerRadius * Math.cos(radAngle + (Math.PI / segments));
        const endY = centerY + innerRadius * Math.sin(radAngle + (Math.PI / segments));
        
        const controlX = centerX + controlRadius * Math.cos(radAngle + (Math.PI / (segments * 2)));
        const controlY = centerY + controlRadius * Math.sin(radAngle + (Math.PI / (segments * 2)));
        
        const outerX = centerX + outerRadius * Math.cos(radAngle + (Math.PI / (segments * 2)));
        const outerY = centerY + outerRadius * Math.sin(radAngle + (Math.PI / (segments * 2)));
        
        // Create petal path
        paths.push(
          <path
            key={`petal-${layer}-${seg}`}
            d={`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={borderWidth / (layer + 1) * 0.8}
            opacity={0.6}
            transform={animate ? `rotate(${rotationSpeed}deg)` : ''}
            style={animate ? { transformOrigin: 'center', animation: `rotate ${20 - rotationSpeed * 2}s infinite linear` } : {}}
          />
        );
        
        // Add decorative dots
        if (layer === layers - 1) {
          paths.push(
            <circle
              key={`dot-${seg}`}
              cx={outerX}
              cy={outerY}
              r={borderWidth / 2}
              fill={primaryColors[colorIndex]}
              opacity={0.8}
            />
          );
        }
      }
    }
    
    // Define CSS animation
    const animation = `
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <style>{animation}</style>
        <defs>
          <radialGradient id="nepaliGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="80%" stopColor={primaryColors[colorIndex]} stopOpacity="0.05" />
            <stop offset="100%" stopColor={secondaryColors[colorIndex]} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="url(#nepaliGradient)"
          stroke={primaryColors[colorIndex]}
          strokeWidth={borderWidth}
        />
        
        {/* Mandala patterns */}
        <g className="mandala-pattern">
          {circles}
          {paths}
        </g>
        
        {/* Central symbol - Aum or similar */}
        <text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          fontSize={maxRadius / 3}
          fill={primaryColors[colorIndex]}
          fontFamily="serif"
          opacity="0.7"
        >
          ॐ
        </text>
      </svg>
    );
  };
  
  return (
    <Card className="w-full overflow-hidden bg-background/30 backdrop-blur-md border-muted/30">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold tracking-tight">
            Wallet Visualization
          </h3>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setHideBalances(!hideBalances)}>
                    {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {hideBalances ? 'Show balances' : 'Hide balances'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowLegend(!showLegend)}>
                    <Info size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Toggle legend
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">NPT Balance</span>
              <span className="text-xl font-semibold">
                {hideBalances ? '••••••••' : `${parseFloat(balance.npt).toLocaleString()} NPT`}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">BNB Balance</span>
              <span className="text-xl font-semibold">
                {hideBalances ? '••••••••' : `${parseFloat(balance.bnb).toLocaleString()} BNB`}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex justify-center items-center mt-2">
          {generateSvg()}
        </div>
        
        {showLegend && (
          <div className="mt-2 p-3 bg-muted/30 rounded-md border border-border/50">
            <h4 className="font-medium mb-2">Visualization Legend</h4>
            <p className="text-sm text-muted-foreground">
              {helpText}
            </p>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Badge variant="outline" className="flex justify-center items-center gap-1 py-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs">NPT Balance</span>
              </Badge>
              
              <Badge variant="outline" className="flex justify-center items-center gap-1 py-1">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-xs">BNB Balance</span>
              </Badge>
              
              <Badge variant="outline" className="flex justify-center items-center gap-1 py-1">
                <div className="w-3 h-3 border-2 border-primary rounded-full"></div>
                <span className="text-xs">Segments = Activity</span>
              </Badge>
              
              <Badge variant="outline" className="flex justify-center items-center gap-1 py-1">
                <div className="w-3 h-3 animate-spin border-2 border-t-secondary rounded-full"></div>
                <span className="text-xs">Rotation = Transactions</span>
              </Badge>
            </div>
          </div>
        )}
        
        <div className="space-y-3 mt-2">
          <Tabs defaultValue={size} onValueChange={(value) => setSize(value as VisualizationSize)}>
            <Label className="text-sm text-muted-foreground mb-1 block">Visualization Size</Label>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="small">Small</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="large">Large</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs defaultValue={theme} onValueChange={(value) => setTheme(value as VisualizationTheme)}>
            <Label className="text-sm text-muted-foreground mb-1 block">Art Style</Label>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="mandala">Mandala</TabsTrigger>
              <TabsTrigger value="thangka">Thangka</TabsTrigger>
              <TabsTrigger value="himalaya">Himalaya</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="animate" className="text-sm text-muted-foreground">Animation</Label>
            <Switch id="animate" checked={animate} onCheckedChange={setAnimate} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NepaliWalletVisualization;