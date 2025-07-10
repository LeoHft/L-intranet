import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const reset = (fields = null) => {
        if (fields) {
            // Reset de champs spécifiques
            const newData = { ...data };
            if (Array.isArray(fields)) {
                fields.forEach(field => {
                    newData[field] = '';
                });
            } else {
                newData[fields] = '';
            }
            setData(newData);
        } else {
            // Reset complet
            setData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.put('/api/password', {
                current_password: data.current_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            toast.success('Mot de passe mis à jour avec succès');
            setRecentlySuccessful(true);
            reset();

            // Masquer le message de succès après 3 secondes
            setTimeout(() => {
                setRecentlySuccessful(false);
            }, 3000);

        } catch (error) {
            if (error.response && error.response.status === 422) {
                const responseErrors = error.response.data.errors || {};
                setErrors(responseErrors);

                // Gestion du focus selon les erreurs
                if (responseErrors.password) {
                    reset(['password', 'password_confirmation']);
                    passwordInput.current?.focus();
                }

                if (responseErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }

                toast.error('Veuillez corriger les erreurs dans le formulaire');
            } else {
                toast.error('Erreur lors de la mise à jour du mot de passe');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={'rounded-lg shadow-lg p-6 border border-rose-200/30'}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Mettre à jour le mot de passe
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.
                </p>
            </header>
            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Mot de passe actuel"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData({ ...data, current_password: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData({ ...data, password_confirmation: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

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
            <Toaster />
        </section>
    );
}
