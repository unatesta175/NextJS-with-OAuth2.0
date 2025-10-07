import React from 'react';
import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#f0f9ff',
      color: '#065f46',
      border: '1px solid #10b981',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#f0f9ff',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #ef4444',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fef2f2',
    },
  });
};

export const showValidationErrorToast = (errors: Record<string, string[]> | string) => {
  if (typeof errors === 'string') {
    showErrorToast(errors);
    return;
  }

  // Handle Laravel validation errors format
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');

  toast.error(
    <div className="space-y-1">
      <div className="font-semibold">Validation Errors:</div>
      <div className="text-sm whitespace-pre-line">{errorMessages}</div>
    </div>,
    {
      duration: 6000,
      position: 'top-right',
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #ef4444',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
    }
  );
};

export const showConfirmationToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast((t) => (
    <div className="flex flex-col space-y-3">
      <span className="text-sm font-medium">{message}</span>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
        >
          Confirm
        </button>
        <button
          className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
          onClick={() => {
            onCancel?.();
            toast.dismiss(t.id);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-right',
    style: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
    },
  });
};

export const showUpdateConfirmationToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast((t) => (
    <div className="flex flex-col space-y-3">
      <span className="text-sm font-medium">{message}</span>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
        >
          Update
        </button>
        <button
          className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
          onClick={() => {
            onCancel?.();
            toast.dismiss(t.id);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-right',
    style: {
      background: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb',
    },
  });
};