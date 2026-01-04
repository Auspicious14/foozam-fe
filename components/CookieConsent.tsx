import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../modules/analytics/context';

const CookieConsent: React.FC = () => {
  const { isOptedOut, optIn, optOut } = useAnalytics();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    optIn();
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    optOut();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-6 z-[100] border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-up">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Privacy Preference</h3>
        <p className="text-sm text-gray-600">
          We use cookies and anonymous tracking to improve your experience and analyze project engagement. 
          By accepting, you help us make Foozam better!
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleDecline}
          className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-2.5 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
