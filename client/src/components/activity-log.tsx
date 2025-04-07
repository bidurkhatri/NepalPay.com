import React from 'react';
import { Activity } from '@/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityLogProps {
  activities: Activity[];
  loading: boolean;
  onViewAll?: () => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ 
  activities, 
  loading,
  onViewAll
}) => {
  if (loading) {
    return (
      <div className="glass cyber-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/20 animated-border">
          <h3 className="font-semibold text-lg text-white">Activity Log</h3>
        </div>
        <div className="divide-y divide-primary/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-3 flex items-start space-x-3">
              <Skeleton className="h-2 w-2 rounded-full mt-1.5 bg-primary/50" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1 bg-primary/20" />
                <Skeleton className="h-3 w-24 bg-primary/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityDot = (action: string) => {
    let bgColor = 'bg-primary/80';
    let ringColor = 'ring-1 ring-primary';
    let pulseEffect = '';

    if (action.includes('LOGIN') || action.includes('REGISTER')) {
      bgColor = 'bg-green-400';
      ringColor = 'ring-1 ring-green-500';
    } else if (action.includes('FAILED')) {
      bgColor = 'bg-yellow-400';
      ringColor = 'ring-1 ring-yellow-500';
      pulseEffect = 'animate-pulse';
    } else if (action.includes('TRANSACTION')) {
      bgColor = 'bg-blue-400';
      ringColor = 'ring-1 ring-blue-500';
    }

    return <div className={`h-2 w-2 rounded-full ${bgColor} ${ringColor} ${pulseEffect}`}></div>;
  };

  const formatDate = (dateString: string | undefined) => {
    // Ensure dateString is valid
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in activity log:', dateString);
        return 'Invalid date';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return `Today, ${format(date, 'hh:mm a')}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${format(date, 'hh:mm a')}`;
      } else {
        return format(date, 'MMM dd, hh:mm a');
      }
    } catch (error) {
      console.error('Error formatting date in activity log:', error);
      return 'Date error';
    }
  };

  const formatActivityTitle = (activity: Activity) => {
    // Use description (new field) or details (legacy field) or action
    let title = activity.description || activity.details || activity.action;
    
    // Clean up the action for display if description/details not provided
    if (!activity.description && !activity.details) {
      title = activity.action
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
    }
    
    return title;
  };

  return (
    <div className="glass cyber-card rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-primary/20 animated-border">
        <h3 className="font-semibold text-lg text-white">Activity Log</h3>
      </div>
      
      {activities.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-white/60">No activities found</p>
        </div>
      ) : (
        <div className="divide-y divide-primary/10">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="px-6 py-3 flex items-start space-x-3 hover:bg-primary/5 transition-colors group">
              <div className="flex-shrink-0 mt-1">
                {getActivityDot(activity.action)}
              </div>
              <div>
                <p className="text-sm text-white group-hover:text-primary transition-colors duration-300">{formatActivityTitle(activity)}</p>
                <p className="text-xs text-white/60">{formatDate(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 0 && onViewAll && (
        <div className="px-6 py-3 bg-black/30 border-t border-primary/20 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:text-white transition-colors"
          >
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
