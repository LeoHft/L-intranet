import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import { useAuthAttributes } from '@/context/AuthAttributsContext';
import { updateCurrentUserPassword } from '@/api/modules/users';

import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdatePasswordForm() {
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    const [data, setData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);


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
                new_password: '',
                new_password_confirmation: '',
            });
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const handleSuccess = (response) => {
            authContext.FetchUserAttributes(); // Met à jour les attributs de l'utilisateur dans le contexte
            setProcessing(false);
            return response.message;
        };

        toast.promise(
            updateCurrentUserPassword(data),
            {
                loading: 'Modification de votre profil en cours',
                success: handleSuccess,
                error: (error) => {
                    setProcessing(false);
                    return error.message;
                }
            }
        );
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

                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.new_password}
                        onChange={(e) => setData({ ...data, new_password: e.target.value })}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.new_password_confirmation}
                        onChange={(e) =>
                            setData({ ...data, new_password_confirmation: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

                </div>
            </form>
            <Toaster />
        </section>
    );
}
