"use client";

import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ShareIconButtonProps {
  sharingUrl: string;
}

export const ShareIconButton: React.FC<ShareIconButtonProps> = ({ sharingUrl }) => {
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OxyBoost Exercise',
          text: 'Check out this breathing exercise',
          url: sharingUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(sharingUrl);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleShareClick}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent"
            aria-label="Share this exercise"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this exercise</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 