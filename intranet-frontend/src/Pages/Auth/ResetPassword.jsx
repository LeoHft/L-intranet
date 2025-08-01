import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import GuestLayout from '@/Layouts/GuestLayout';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';


export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Récupération des paramètres depuis l'URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [data, setData] = useState({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = "Reset Password - Intranet";
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/api/auth/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Réinitialiser le formulaire et rediriger vers la page de connexion
                setData({
                    token: token || '',
                    email: email || '',
                    password: '',
                    password_confirmation: '',
                });
                navigate('/login', { 
                    state: { message: 'Password reset successfully! Please login with your new password.' }
                });
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || { general: ['Password reset failed'] });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setErrors({ general: ['An error occurred. Please try again.'] });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Reset Password</h2>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />

                    <InputError message={errors.email?.[0]} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />

                    <InputError message={errors.password?.[0]} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData({ ...data, password_confirmation: e.target.value })
                        }
                    />

                    <InputError
                        message={errors.password_confirmation?.[0]}
                        className="mt-2"
                    />
                </div>

                {errors.general && (
                    <div className="mt-4">
                        <InputError message={errors.general[0]} />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
