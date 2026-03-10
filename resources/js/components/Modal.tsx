import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    show: boolean;
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [show]);

    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-hidden pointer-events-auto">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity animate-fade-in cursor-pointer" 
                onClick={onClose} 
            />
            
            {/* Content Container (Center focused) */}
            <div className="relative z-10 w-full max-w-sm transform transition-all animate-scale-in flex items-center justify-center">
                {children}
            </div>
        </div>,
        document.body
    );
};
