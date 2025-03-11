"use client";

import { Button } from "@/components/ui/button";

export default function AuthModal({
  children,
  triggerText,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  triggerText: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <>
      {!triggerText ? null : (
        <Button onClick={() => setIsOpen(true)}>{triggerText}</Button>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 transform transition-all duration-300 animate-slide-in">
            <div className="flex justify-end p-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>X</Button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}