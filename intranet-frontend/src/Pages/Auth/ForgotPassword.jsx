import GuestLayout from '@/Layouts/GuestLayout';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword({}) {
    const [data, setData] = useState({
        email: '',
    });

    useEffect(() => {
        document.title = "Forgot password - Intranet";
    }, []);



    return (
        <GuestLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="mb-4 bg-gradient-to-r from-white/5 to-white/20 text-ml text-gray-600 max-w-lg text-center justify-center mx-auto block w-full rounded-md shadow-xl p-6">
                    Mot de passe oublié ? <br/> Pas de souci, demandez à votre administrateur de réinitialiser votre mot de passe.
                </div>
            </div>
        </GuestLayout>
    );
}
