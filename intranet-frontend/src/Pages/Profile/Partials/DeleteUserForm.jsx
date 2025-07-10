import DangerButton from '@/Components/Utils/DangerButton';
import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import Modal from '@/Components/Utils/Modal';
import SecondaryButton from '@/Components/Utils/SecondaryButton';
import TextInput from '@/Components/Utils/TextInput';

import { useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        password: '',
    });
    const passwordInput = useRef();

    const reset = () => {
        setData({
            password: '',
        });
    };

    const clearErrors = () => {
        setErrors({});
    };

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.delete('/api/profile', {
                data: { password: data.password }
            });
            
            toast.success('Compte supprimé avec succès');
            closeModal();
            // Redirection vers la page de connexion ou d'accueil
            window.location.href = '/login';
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                toast.error('Erreur lors de la suppression du compte');
            }
            passwordInput.current?.focus();
        } finally {
            setProcessing(false);
            reset();
        }
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={'rounded-lg space-y-6 shadow-lg p-6 border border-rose-200/30'}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Supprimer le compte
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Une fois votre compte supprimé, toutes ses ressources et
                    données seront définitivement supprimées.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Supprimer le compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Êtes-vous sûr de vouloir supprimer votre compte ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Une fois votre compte supprimé, toutes ses ressources et
                        données seront définitivement supprimées. Veuillez entrer
                        votre mot de passe pour confirmer que vous souhaitez
                        supprimer définitivement votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Mot de passe"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Annuler
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Supprimer le compte
                        </DangerButton>
                    </div>
                </form>
            </Modal>
            <Toaster />
        </section>
    );
}
