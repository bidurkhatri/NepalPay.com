import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define types for settings
export type ThemeType = 'cyber' | 'dark' | 'light';
export type DisplayMode = 'light' | 'dark' | 'auto';
export type AccentColor = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
export type Language = 'en' | 'np' | 'hi' | 'zh' | 'ja';
export type CurrencyFormat = 'npr' | 'usd' | 'eur' | 'gbp' | 'jpy';
export type DateFormat = 'mdy' | 'dmy' | 'ymd';

export interface NotificationSettings {
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingUpdates: boolean;
  soundAlerts: boolean;
}

export interface AppSettings {
  // Appearance
  theme: ThemeType;
  displayMode: DisplayMode;
  accentColor: AccentColor;
  
  // Language & Region
  language: Language;
  currencyFormat: CurrencyFormat;
  dateFormat: DateFormat;
  
  // Notifications
  notifications: NotificationSettings;
  
  // Privacy & Security
  twoFactorEnabled: boolean;
}

// Default settings
const defaultSettings: AppSettings = {
  theme: 'cyber',
  displayMode: 'dark',
  accentColor: 'default',
  
  language: 'en',
  currencyFormat: 'npr',
  dateFormat: 'mdy',
  
  notifications: {
    transactionAlerts: true,
    securityAlerts: true,
    marketingUpdates: false,
    soundAlerts: true
  },
  
  twoFactorEnabled: false
};

// Create the context
interface SettingsContextType {
  settings: AppSettings;
  updateTheme: (theme: ThemeType) => void;
  updateDisplayMode: (mode: DisplayMode) => void;
  updateAccentColor: (color: AccentColor) => void;
  updateLanguage: (lang: Language) => void;
  updateCurrencyFormat: (format: CurrencyFormat) => void;
  updateDateFormat: (format: DateFormat) => void;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  toggleTwoFactor: () => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('nepaliPaySettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nepaliPaySettings', JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    
    if (settings.displayMode === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(settings.displayMode);
    }
    
    // Apply accent color (via CSS variables, would need to be implemented in theme.json for production)
  }, [settings]);
  
  // Update functions
  const updateTheme = (theme: ThemeType) => {
    setSettings(prev => ({ ...prev, theme }));
  };
  
  const updateDisplayMode = (displayMode: DisplayMode) => {
    setSettings(prev => ({ ...prev, displayMode }));
  };
  
  const updateAccentColor = (accentColor: AccentColor) => {
    setSettings(prev => ({ ...prev, accentColor }));
  };
  
  const updateLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };
  
  const updateCurrencyFormat = (currencyFormat: CurrencyFormat) => {
    setSettings(prev => ({ ...prev, currencyFormat }));
  };
  
  const updateDateFormat = (dateFormat: DateFormat) => {
    setSettings(prev => ({ ...prev, dateFormat }));
  };
  
  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };
  
  const toggleTwoFactor = () => {
    setSettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults",
    });
  };
  
  const saveSettings = () => {
    // In a real app, you might also want to save to a backend
    localStorage.setItem('nepaliPaySettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully",
    });
  };
  
  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateTheme,
        updateDisplayMode,
        updateAccentColor,
        updateLanguage,
        updateCurrencyFormat,
        updateDateFormat,
        updateNotificationSetting,
        toggleTwoFactor,
        resetSettings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Hook for using the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};