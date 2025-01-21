import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-900 fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="rounded bg-white p-6 shadow-lg">
      <h3 className="text-lg mb-2font-semibold text-black dark:text-white">
            {title}
          </h3>
          <span className="flex justify-end gap-4 border-t border-stroke pt-4 dark:border-strokedark"></span>
        <div className="flex items-center">
          <div>
            <p className="text-base leading-relaxed text-body">{message}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="btn btn-cancel mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
