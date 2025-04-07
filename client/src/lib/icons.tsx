import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Smartphone, Zap } from 'lucide-react';

// Using Lucide React icons with custom wrapper functions
export const SendIcon = (props: React.ComponentProps<typeof ArrowUpRight>) => (
  <ArrowUpRight {...props} />
);

export const ReceiveIcon = (props: React.ComponentProps<typeof ArrowDownLeft>) => (
  <ArrowDownLeft {...props} />
);

export const MobileIcon = (props: React.ComponentProps<typeof Smartphone>) => (
  <Smartphone {...props} />
);

export const ElectricityIcon = (props: React.ComponentProps<typeof Zap>) => (
  <Zap {...props} />
);