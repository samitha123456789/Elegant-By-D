"use client";

export default function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
      {message}
      <button onClick={onClose} className="ml-4 text-white">X</button>
    </div>
  );
}