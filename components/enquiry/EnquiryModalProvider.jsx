"use client";

import { createContext, useCallback, useContext, useState } from "react";
import EnquiryModal from "./EnquiryModal";

const EnquiryModalContext = createContext(null);

export function EnquiryModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({});
  const [triggerEl, setTriggerEl] = useState(null);

  const open = useCallback((nextContext = {}) => {
    setTriggerEl(
      typeof document !== "undefined" ? document.activeElement : null
    );
    setContext(nextContext);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <EnquiryModalContext.Provider value={{ open }}>
      {children}
      <EnquiryModal
        isOpen={isOpen}
        context={context}
        triggerEl={triggerEl}
        onClose={close}
      />
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) {
    throw new Error("useEnquiryModal must be used within EnquiryModalProvider");
  }
  return ctx;
}
