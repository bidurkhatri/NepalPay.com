import React, { ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button 
      className="flex flex-col items-center justify-center glass p-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 glow group"
      onClick={onClick}
    >
      <div className="p-3 bg-primary/10 rounded-full mb-2 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
        {React.cloneElement(icon as React.ReactElement, { className: "text-primary text-xl" })}
      </div>
      <span className="text-sm font-medium text-white group-hover:text-primary transition-colors duration-300">{label}</span>
    </button>
  );
};

export default ActionButton;
