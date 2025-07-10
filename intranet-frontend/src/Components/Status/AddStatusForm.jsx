import PrimaryButton from '@/Components/Utils/PrimaryButton';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import toast, { Toaster } from 'react-hot-toast';
import { useState, useRef } from 'react';
import axios from 'axios';


export default function AddStatusForm() {
    const [showingAddStatusModal, setShowingAddStatusModal] = useState(false);
    const name = useRef();
    const description = useRef();
    const [data, setData] = useState({
        name: '',
        description: '',
    });

    const reset = () => {
        setData({
            name: '',
            description: '',
        });
        setShowingAddStatusModal(false);
    };

    const AddStatus = () => {
        setShowingAddStatusModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/storeStatus', {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            toast.success('Statut ajouté avec succès');
            reset();
            setShowingAddStatusModal(false);
        }).catch(error => {
            console.error("Error adding Status:", error);
            toast.error('Erreur lors de l\'ajout du statut');
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddStatus}> Ajouter un status </PrimaryButton>

            <Modal show={showingAddStatusModal} onClose={() => setShowingAddStatusModal(false)}>
                <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter un status
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom du status*" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value})}
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
                            onChange={(e) => setData({ ...data, description: e.target.value})}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Description du status"
                        />
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