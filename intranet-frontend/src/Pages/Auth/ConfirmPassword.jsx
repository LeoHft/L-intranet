import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import GuestLayout from '@/Layouts/GuestLayout';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ConfirmPassword() {
    const navigate = useNavigate();
    const [data, setData] = useState({ password: '' });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = "Confirm password - Intranet";
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/api/auth/password/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    password: data.password
                }),
            });

            if (response.ok) {
                // Réinitialiser le mot de passe et rediriger
                setData({ password: '' });
                navigate('/dashboard'); // ou vers la page appropriée
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || { password: ['Password confirmation failed'] });
            }
        } catch (error) {
            console.error('Error confirming password:', error);
            setErrors({ password: ['An error occurred. Please try again.'] });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />

                    <InputError message={errors.password?.[0]} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Confirm
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
