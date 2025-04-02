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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-900">Activity Log</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-3 flex items-start space-x-3">
              <Skeleton className="h-2 w-2 rounded-full mt-1.5" />
              <div>
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityDot = (action: string) => {
    let bgColor = 'bg-gray-500';

    if (action.includes('LOGIN') || action.includes('REGISTER')) {
      bgColor = 'bg-green-500';
    } else if (action.includes('FAILED')) {
      bgColor = 'bg-yellow-500';
    } else if (action.includes('TRANSACTION')) {
      bgColor = 'bg-blue-500';
    }

    return <div className={`h-2 w-2 rounded-full ${bgColor}`}></div>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  };

  const formatActivityTitle = (activity: Activity) => {
    let title = activity.details || activity.action;
    
    // Clean up the action for display if details not provided
    if (!activity.details) {
      title = activity.action
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
    }
    
    return title;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg text-gray-900">Activity Log</h3>
      </div>
      
      {activities.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-gray-500">No activities found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="px-6 py-3 flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityDot(activity.action)}
              </div>
              <div>
                <p className="text-sm text-gray-800">{formatActivityTitle(activity)}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 0 && onViewAll && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
