import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';
import Modal from '@/Components/Utils/Modal';

import { addUser } from '@/api/modules/users';

import { useState } from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';


export default function AddUserForm({ onUserAdded }) {
    const [showingAddUserModal, setShowingAddUserModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        'is_admin': false,
    });

    const reset = () => {
        setData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            'is_admin': false,
        });
        setErrors({});
        setShowingAddUserModal(false);
    };


    const AddUser = () => {
        setShowingAddUserModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Reset des erreurs

        toast.promise(
            addUser(data),
            {
                loading: 'Ajout de l\'utilisateur ...',
                success: (response) => {
                    reset();
                    onUserAdded();
                    return response.message;
                },
                error: (error) => {
                    return error.message;
                }
            }
        );
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
                                onChange={(e) => setData({ ...data, name: e.target.value})}
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
                                onChange={(e) => setData({ ...data, email: e.target.value})}
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
                                onChange={(e) => setData({ ...data, password: e.target.value})}
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
                                onChange={(e) => setData({ ...data, password_confirmation: e.target.value})}
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
                                onChange={(e) => setData({ ...data, is_admin: e.target.checked})}
                            />
                            <label htmlFor="is_admin" className="text-ml text-gray-700 cursor-pointer hover:text-gray-500 transition ml-2 ">
                                Administrateur
                            </label>
                            <InputError message={errors.is_admin} className="mt-3" />
                        </div>
                        <button type="submit" className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                            Valider
                        </button>

                    </form>
                </Modal>
            <Toaster />
        </section>

    );
}
