import React, { ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button 
      className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-3 bg-primary-50 rounded-full mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default ActionButton;
