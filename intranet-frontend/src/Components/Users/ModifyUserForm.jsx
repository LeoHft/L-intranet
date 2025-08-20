import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';
import InputError from '@/Components/Utils/InputError';

import { updateUser } from '@/api/modules/users';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';


export default function ModifyUserForm({ user, onClose, onSuccess }) {
    const [errors, setErrors] = useState({});
    const name = useRef();
    const email = useRef();
    const is_admin = useRef();
    const [data, setData] = useState({
        name: '',
        email: '',
        is_admin: false,
    });

    const reset = () => {
        setData({
            name: '',
            email: '',
            is_admin: false,
        });
        setErrors({});
    };


    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                is_admin: user.is_admin || false,
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        toast.promise(
            updateUser(data, user.id),
            {
                loading: 'Modification de l\'utilisateur ...',
                success: (response) => {
                    reset();
                    if (onClose) {
                        onClose(); // Ferme le modal dans le parent
                    }
                    if (onSuccess) {
                        onSuccess(); // Rafraîchit la liste
                    }  
                    return response.message;
                },
                error: (error) => {
                    // Gestion des erreurs de validation
                    if (error.response?.data?.errors) {
                        setErrors(error.response.data.errors);
                    }
                    return error.message;
                }
            }
        );
    };

    return (
        <Modal show={true} onClose={() => { onClose(); }}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-lg font-medium">
                    Modifier un utilisateur
                </h1>
                <div className="form-control">
                    <InputLabel htmlFor="name" value="Nom de l'utilisateur*" />
                    <TextInput
                        id="name"
                        ref={name}
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value})}
                        type="text"
                        className="w-full"
                        placeholder="Nom de l'utilisateur"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="form-control">
                    <InputLabel htmlFor="email" value="Email*" />
                    <TextInput
                        id="email"
                        ref={email}
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value})}
                        type="text"
                        className="w-full"
                        placeholder="Email de l'utilisateur"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <input
                            id="is_admin"
                            type="checkbox"
                            name="is_admin"
                            ref={is_admin}
                            checked={data.is_admin}
                            className="checkbox checkbox-primary"
                            onChange={(e) => setData({ ...data, is_admin: e.target.checked})}
                        />
                        <span className="label-text ml-2">Administrateur</span>
                    </label>
                    <InputError message={errors.is_admin} className="mt-3" />
                </div>
                <button type="submit" className="btn btn-primary">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
