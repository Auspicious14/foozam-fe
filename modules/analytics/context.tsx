import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface AnalyticsContextType {
  anonymousId: string | null;
  trackEvent: (eventType: string, metadata?: any) => void;
  optOut: () => void;
  optIn: () => void;
  isOptedOut: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [isOptedOut, setIsOptedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for opt-out preference
    const optedOut = localStorage.getItem('analytics_opt_out') === 'true';
    setIsOptedOut(optedOut);

    // Respect Do Not Track
    if (window.navigator.doNotTrack === '1') {
      setIsOptedOut(true);
    }

    // Initialize anonymous ID
    let id = localStorage.getItem('anonymous_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anonymous_id', id);
    }
    setAnonymousId(id);
  }, []);

  const trackEvent = async (eventType: string, metadata: any = {}) => {
    if (isOptedOut || !anonymousId) return;

    try {
      await api.post('/analytics/event', {
        anonymousId,
        eventType,
        path: window.location.pathname,
        referrer: document.referrer,
        deviceInfo: {
          browser: getBrowserName(),
          os: getOSName(),
        },
        metadata,
      });
    } catch (err) {
      console.error('Failed to track event', err);
    }
  };

  const optOut = () => {
    localStorage.setItem('analytics_opt_out', 'true');
    setIsOptedOut(true);
  };

  const optIn = () => {
    localStorage.removeItem('analytics_opt_out');
    setIsOptedOut(false);
  };

  // Track page views on route change
  useEffect(() => {
    if (anonymousId) {
      trackEvent('page_view');
    }
  }, [router.pathname, anonymousId]);

  return (
    <AnalyticsContext.Provider value={{ anonymousId, trackEvent, optOut, optIn, isOptedOut }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Helper functions for device info
function getBrowserName() {
  const ua = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getOSName() {
  const ua = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone')) return 'iOS';
  return 'Unknown';
}
