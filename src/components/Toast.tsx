import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <AlertCircle className="text-blue-500" size={24} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg border-2 ${colors[type]} animate-slide-in`}
    >
      {icons[type]}
      <p className="font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 hover:bg-white hover:bg-opacity-50 p-1 rounded transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
