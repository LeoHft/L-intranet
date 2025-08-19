import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useEffect } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    noPadding = false,
}) {
    // Gérer l'overflow du body et compenser la disparition de la scrollbar
    useEffect(() => {
        if (show) {
            // Calculer la largeur de la scrollbar avant de la cacher
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            // Sauvegarder les styles originaux
            const originalStyle = window.getComputedStyle(document.body);
            const originalOverflow = originalStyle.overflow;
            const originalPaddingRight = originalStyle.paddingRight;
            
            // Appliquer les nouveaux styles
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${parseInt(originalPaddingRight) + scrollBarWidth}px`;
            
            return () => {
                // Restaurer les styles originaux
                document.body.style.overflow = originalOverflow;
                document.body.style.paddingRight = originalPaddingRight;
            };
        }
    }, [show]);

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal-box w-full max-w-sm',
        md: 'modal-box w-full max-w-md',
        lg: 'modal-box w-full max-w-lg',
        xl: 'modal-box w-full max-w-xl',
        '2xl': 'modal-box w-full max-w-2xl',
    }[maxWidth];

    const modalClass = noPadding ? `${maxWidthClass} !p-0` : maxWidthClass;

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="modal modal-open"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="modal-backdrop" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={modalClass}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}