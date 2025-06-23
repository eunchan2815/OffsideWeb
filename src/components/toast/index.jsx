import { useEffect, useState } from "react";

export const Toast = ({ message, show, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setExiting(false);
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          onClose();
        }, 300); // 애니메이션 시간과 동일
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg ${
        exiting ? "toast-exit" : "toast-enter"
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {message}
    </div>
  );
};
