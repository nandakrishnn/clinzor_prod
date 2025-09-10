import React from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-foreground border border-border rounded-lg hover:bg-background disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};