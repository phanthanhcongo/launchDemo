import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/atoms';
import { 
  BuildingOfficeIcon, 
  RectangleStackIcon, 
  PaintBrushIcon, 
  ArrowPathIcon 
} from '@/components/ui';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';

export interface VREmbedProps {
  type?: 'vr' | 'floorplans' | 'visualisation' | 'all';
  showTabs?: boolean;
  height?: number;
  title?: string;
  className?: string;
}

const VR_URLS = {
  vr: 'http://explore.nyalavillas.com/vr',
  floorplans: 'http://explore.nyalavillas.com/floorplans',
  visualisation: 'http://explore.nyalavillas.com/visualisation',
};

const VR_TABS = [
  {
    id: 'vr',
    label: 'VR Tour',
    icon: <BuildingOfficeIcon size="sm" />,
    description: 'Immersive virtual reality experience',
    url: VR_URLS.vr,
  },
  {
    id: 'floorplans',
    label: 'Floor Plans',
    icon: <RectangleStackIcon size="sm" />,
    description: 'Interactive floor plan viewer',
    url: VR_URLS.floorplans,
  },
  {
    id: 'visualisation',
    label: 'Visualisation',
    icon: <PaintBrushIcon size="sm" />,
    description: 'Architectural renderings and galleries',
    url: VR_URLS.visualisation,
  },
];

/**
 * VREmbed Component
 * 
 * Embeds VR experiences directly into the page with smooth animations
 * and responsive design using Shadcn/UI components.
 */
export function VREmbed({
  type = 'all',
  showTabs = true,
  height = 400,
  title = 'Virtual Experience',
  className,
}: VREmbedProps) {
  const [activeTab, setActiveTab] = useState<'vr' | 'floorplans' | 'visualisation'>(
    type === 'all' ? 'vr' : type as 'vr' | 'floorplans' | 'visualisation'
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading progress
  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    setActiveTab(value as 'vr' | 'floorplans' | 'visualisation');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
  };

  // Single embed mode
  if (!showTabs && type !== 'all') {
    const url = VR_URLS[type as keyof typeof VR_URLS];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("w-full", className)}
      >
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-primary">{title}</CardTitle>
            <CardDescription className="text-primary/90">
              {VR_TABS.find(tab => tab.id === type)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <ArrowPathIcon size="lg" className="animate-spin text-primary mx-auto" />
                    <Progress value={loadingProgress} className="w-32" />
                  </div>
                </div>
              )}
              <iframe
                src={url}
                width="100%"
                height={height}
                frameBorder="0"
                allowFullScreen
                className="w-full rounded-b-lg"
                title={`${type} Experience`}
                onLoad={handleIframeLoad}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Tabbed mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-primary">{title}</CardTitle>
          <CardDescription className="text-primary/90">
            Explore Nyala Villas through multiple interactive experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {VR_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-sm font-medium transition-all flex items-center gap-2"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <AnimatePresence mode="wait">
              {VR_TABS.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                      </h4>
                      <p className="text-primary/90 text-sm mb-4">
                        {tab.description}
                      </p>
                      
                      {isLoading && activeTab === tab.id && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowPathIcon size="sm" className="animate-spin text-primary" />
                            <span className="text-sm text-primary/90">Loading experience...</span>
                          </div>
                          <Progress value={loadingProgress} className="w-full" />
                        </div>
                      )}
                    </div>
                    
                    <div className="relative rounded-lg overflow-hidden">
                      <iframe
                        src={tab.url}
                        width="100%"
                        height={height}
                        frameBorder="0"
                        allowFullScreen
                        className="w-full"
                        title={`${tab.id} Experience`}
                        onLoad={handleIframeLoad}
                      />
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        intent="ghost"
                        size="sm"
                        onClick={() => window.open(tab.url, '_blank')}
                      >
                        Open in New Tab →
                      </Button>
                      <span className="text-xs text-primary/80">
                        Best viewed in fullscreen
                      </span>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

VREmbed.displayName = 'VREmbed';
