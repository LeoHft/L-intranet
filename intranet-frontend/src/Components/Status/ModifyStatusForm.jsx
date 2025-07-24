import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import { updateStatus } from '@/api/modules/status';

import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyStatusForm({ status, onClose, onSuccess }) {
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
    };

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

        toast.promise(
            updateStatus(data, status.id),
            {
                loading: 'Modification du status en cours ...',
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
                    return error.message;
                }
            }
        );
    };

    return (
        <Modal show={true} onClose={() => { onClose(); }}>
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
                <button type="submit" className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
