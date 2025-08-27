"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showSavePrompt: boolean;
  setShowSavePrompt: (show: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (path: string | null) => void;
  handleSaveAndContinue: () => void;
  onSaveCallback: (() => void) | null;
  setOnSaveCallback: (callback: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [onSaveCallback, setOnSaveCallback] = useState<(() => void) | null>(null);

  const handleSaveAndContinue = useCallback(() => {
    if (onSaveCallback) {
      onSaveCallback();
    }
    setHasUnsavedChanges(false);
    setShowSavePrompt(false);
    
    if (pendingNavigation) {
      window.location.pathname = pendingNavigation;
      setPendingNavigation(null);
    }
  }, [onSaveCallback, pendingNavigation]);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showSavePrompt,
        setShowSavePrompt,
        pendingNavigation,
        setPendingNavigation,
        handleSaveAndContinue,
        onSaveCallback,
        setOnSaveCallback,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
}