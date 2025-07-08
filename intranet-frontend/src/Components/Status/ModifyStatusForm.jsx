import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import { useEffect, useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyStatusForm({ status, onClose }) {
    const [showingModifyStatusModal, setShowingModifyStatusModal] = useState(true);
    const name = useRef();
    const description = useRef();

    const { data, setData, reset } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (status) {
            setData({
                name: status.name || '',
                description: status.description || '',
            });
        }
    }, [status]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`/api/updateStatus/${status.id}`, {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            toast.success('Statut modifié avec succès');
            reset();
            setShowingModifyStatusModal(false);
            onClose(); 
        }).catch(error => {
            console.error("Error modifying status:", error);
            toast.error('Erreur lors de la modification du statut');
        });
    };

    return (
        <Modal show={showingModifyStatusModal} onClose={() => { setShowingModifyStatusModal(false); onClose(); }}>
            <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier un status
                </h1>
                <div>
                    <InputLabel htmlFor="name" value="Nom du status*" />
                    <TextInput
                        id="name"
                        ref={name}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Nom du status"
                        required
                    />
                </div>
                <div>
                    <InputLabel htmlFor="description" value="Description max: 255" />
                    <TextInput
                        id="description"
                        ref={description}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Description du status"
                    />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
