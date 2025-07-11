import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      "text-2xl font-bold tracking-normal leading-tight",
      className
    )}>
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      "text-xl font-semibold tracking-normal leading-tight",
      className
    )}>
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn(
      "text-lg font-medium tracking-normal leading-snug",
      className
    )}>
      {children}
    </h3>
  );
}

export function TypographyBody({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      "text-base font-normal tracking-normal leading-relaxed",
      className
    )}>
      {children}
    </p>
  );
}

export function TypographySmall({ children, className }: TypographyProps) {
  return (
    <small className={cn(
      "text-sm font-normal tracking-normal leading-relaxed text-muted-foreground",
      className
    )}>
      {children}
    </small>
  );
}

export function TypographyMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      "text-sm text-muted-foreground tracking-normal leading-relaxed",
      className
    )}>
      {children}
    </p>
  );
}