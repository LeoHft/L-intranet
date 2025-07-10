import PrimaryButton from '@/Components/Utils/PrimaryButton';

import GuestLayout from '@/Layouts/GuestLayout';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';


export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        document.title = "Email Verification - Intranet";
        
        // Récupérer le status depuis l'URL si présent
        const urlStatus = searchParams.get('status');
        if (urlStatus) {
            setStatus(urlStatus);
        }
    }, [searchParams]);

    const handleLogout = () => {
        // Supprimer le token d'authentification
        localStorage.removeItem('auth_token');
        
        // Rediriger vers la page de connexion
        navigate('/login');
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/api/auth/email/verification-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setStatus('verification-link-sent');
            } else {
                console.error('Error sending verification email');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Email Verification</h2>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <button
                        onClick={handleLogout}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Déconnexion
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
