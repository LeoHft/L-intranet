import InputError from '@/Components/Utils.InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';
import Modal from '@/Components/Utils/Modal';

import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';


export default function AddUserForm() {
    const [showingAddUserModal, setShowingAddUserModal] = useState(false);
    const { data, setData, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        'is_admin': false,
    });

    const AddUser = () => {
        setShowingAddUserModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/storeUser', {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            'is_admin': data.is_admin,
        })
        .then(response => {
            reset();
            setShowingAddUserModal(false);
            toast.success('Utilisateur ajouté avec succès');
        }).catch(error => {
            console.error("Error adding Category:", error);
            toast.error('Erreur lors de l\'ajout de l\'utilisateur');
        });
    }


    return (
        <section>
            <PrimaryButton onClick={AddUser}> Ajouter un Utilisateur </PrimaryButton>
            
            <Modal show={showingAddUserModal} onClose={() => setShowingAddUserModal(false)}>
                    <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                        <h1 className="text-lg font-medium text-gray-900">
                            Ajouter un utilisateur
                        </h1>
                        <div>
                            <InputLabel htmlFor="name" value="Nom*" />

                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Nom de l'utilisateur"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email*" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email de l'utilisateur"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Mot de passe*" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Mot de passe de l'utilisateur"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmer le mot de passe*"
                            />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirmer le mot de passe"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 accent-black hover:green-500">
                            <input
                                id="is_admin"
                                type="checkbox"
                                name="is_admin"
                                checked={data.is_admin}
                                className="mt-1 w-4 h-4"
                                onChange={(e) => setData('is_admin', e.target.checked)}
                            />
                            <label htmlFor="is_admin" className="text-ml text-gray-700 cursor-pointer hover:text-gray-500 transition ml-2 ">
                                Administrateur
                            </label>
                            <InputError message={errors.is_admin} className="mt-3" />
                        </div>
                        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                            Valider
                        </button>

                    </form>
                </Modal>
            <Toaster />
        </section>

    );
}
