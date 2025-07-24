import { ToggleContext } from './ToggleContext';

import { useState, useContext } from 'react';
import { Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { HouseWifi } from 'lucide-react';


export default function ToggleSwitch() {
    const { enabled, setEnabled } = useContext(ToggleContext);

    const notification = () => {
        if (!enabled) { 
            toast('Accès depuis le réseau local', {
                icon: '🏠',
            });
        }
        else {
            toast('Accès depuis l\'extérieur du réseau', {
                icon: '🌐',
            });
        }
    }

    return (
        <>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => {
                        setEnabled(!enabled);
                        notification();
                    }}
                    className={`relative flex h-6 w-12 items-center rounded-full transition 
                        ${enabled ? "bg-purple-400" : "bg-pink-200"} border-2 border-purple-500`}
                >
                    <div
                        className={`absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-all 
                            ${enabled ? "translate-x-6" : "translate-x-0"}`}
                    >
                        {enabled ? <Check className="h-4 w-4 text-indigo-600" /> : <X className="h-4 w-4 text-gray-500" />}
                    </div>
                </button>
                <HouseWifi />
                <Toaster />
            </div>
        </>
    );
}
