import { ToggleContext } from './ToggleContext';

import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { HouseWifi } from 'lucide-react';


export default function ToggleSwitch() {
    const { enabled, setEnabled } = useContext(ToggleContext);

    const notification = () => {
        console.log("Notification triggered");
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
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={enabled}
                    onChange={() => {
                        setEnabled(!enabled);
                        notification();
                    }}
                />
                <HouseWifi />
            </div>
        </>
    );
}
