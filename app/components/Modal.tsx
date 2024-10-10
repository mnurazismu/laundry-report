import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-primary-700 p-6 rounded-lg shadow-xl">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;