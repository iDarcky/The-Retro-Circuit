"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ConsentStatus = boolean | null;

interface ConsentContextType {
  consent: ConsentStatus;
  accept: () => void;
  decline: () => void;
  reset: () => void;
  isOpen: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
};

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  // We use a separate isOpen state to control the banner visibility to avoid hydration mismatch
  // Initially false to prevent flash during hydration, then set to true if consent is null
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const storedConsent = localStorage.getItem("cookie_consent");

    if (storedConsent === "true") {
      setConsent(true);
      setIsOpen(false);
    } else if (storedConsent === "false") {
      setConsent(false);
      setIsOpen(false);
    } else {
      setConsent(null);
      // Small timeout to prevent immediate flash if it was just loading
      setIsOpen(true);
    }
  }, []);

  const accept = () => {
    setConsent(true);
    setIsOpen(false);
    localStorage.setItem("cookie_consent", "true");
  };

  const decline = () => {
    setConsent(false);
    setIsOpen(false);
    localStorage.setItem("cookie_consent", "false");
  };

  const reset = () => {
      setConsent(null);
      setIsOpen(true);
      localStorage.removeItem("cookie_consent");
  };

  return (
    <ConsentContext.Provider value={{ consent, accept, decline, reset, isOpen }}>
      {children}
    </ConsentContext.Provider>
  );
};
