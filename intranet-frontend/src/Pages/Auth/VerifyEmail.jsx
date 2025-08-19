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
            <div className="hero min-h-screen">
                <div className="hero-content w-full max-w-md">
                    <div className="card bg-base-100/10 backdrop-blur-sm shadow-xl w-full">
                        <div className="card-body space-y-6">
                            <div className="mb-4">
                                <h2 className="card-title text-xl">Email Verification</h2>
                            </div>

                            <div className="text-sm opacity-70">
                                Thanks for signing up! Before getting started, could you verify
                                your email address by clicking on the link we just emailed to
                                you? If you didn't receive the email, we will gladly send you
                                another.
                            </div>

                            {status === 'verification-link-sent' && (
                                <div className="alert alert-success">
                                    <span className="text-sm">
                                        A new verification link has been sent to the email address
                                        you provided during registration.
                                    </span>
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <div className="flex items-center justify-between">
                                    <PrimaryButton disabled={processing}>
                                        Resend Verification Email
                                    </PrimaryButton>

                                    <button
                                        onClick={handleLogout}
                                        className="link link-hover text-sm opacity-70"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
