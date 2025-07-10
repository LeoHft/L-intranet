import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import { Transition } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useAuthAttributes } from '@/context/AuthAttributsContext';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;

    const [data, setData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    // Mettre à jour les données si l'utilisateur change
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const sendVerificationEmail = async () => {
        try {
            const response = await fetch('/api/auth/email/verification-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                // Vous pouvez gérer le succès ici
                console.log('Verification email sent');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                
                // Mettre à jour le contexte d'authentification
                if (authContext?.setUserAttributes) {
                    authContext.setUserAttributes(updatedUser.user || updatedUser);
                }

                // Mettre à jour localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser.user || updatedUser));

                // Afficher le message de succès
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 3000);
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || { general: ['Update failed'] });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ general: ['An error occurred. Please try again.'] });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={'rounded-lg shadow-lg p-6 border border-rose-200/30'}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informations personnelles
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour les informations de profile et l'adresse e-mail de votre compte.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nom" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name?.[0]} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email?.[0]} />
                </div>

                {mustVerifyEmail && user?.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Votre adresse e-mail n'est pas vérifiée.
                            <button
                                type="button"
                                onClick={sendVerificationEmail}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-1"
                            >
                                Cliquez ici pour renvoyer l'e-mail de vérification.
                            </button>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Un nouveau lien de vérification a été envoyé à votre adresse e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

                    {errors.general && (
                        <InputError message={errors.general[0]} />
                    )}

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Enregistré.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
