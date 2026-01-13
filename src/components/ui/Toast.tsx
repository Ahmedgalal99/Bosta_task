import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Heart, ShoppingCart, X } from "lucide-react";

export type ToastType = "success" | "error" | "cart" | "wishlist";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  cart: <ShoppingCart className="h-5 w-5 text-[#E30613]" />,
  wishlist: <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />,
};

const backgrounds = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  cart: "bg-red-50 border-[#E30613]/20",
  wishlist: "bg-pink-50 border-pink-200",
};

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-[100] flex items-center gap-4 px-6 py-4 
        rounded-xl border shadow-xl backdrop-blur-sm min-w-[280px]
        transition-all duration-300 ease-out
        ${backgrounds[type]}
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
      `}
    >
      <div className="animate-bounce-once">{icons[type]}</div>
      <p className="text-base font-medium text-gray-800 flex-1">{message}</p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(-${index * 8}px)` }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
