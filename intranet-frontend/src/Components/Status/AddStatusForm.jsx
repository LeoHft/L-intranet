import PrimaryButton from '@/Components/Utils/PrimaryButton';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import { storeStatus } from '@/api/modules/status';

import toast, { Toaster } from 'react-hot-toast';
import { useState, useRef } from 'react';


export default function AddStatusForm({ onStatusAdded }) {
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

        toast.promise(
            storeStatus(data),
            {
                loading: 'Ajout du status en cours ...',
                success: (response) => {
                    reset();
                    setShowingAddStatusModal(false);
                    onStatusAdded();
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
            <PrimaryButton onClick={AddStatus}> Ajouter un status </PrimaryButton>

            <Modal show={showingAddStatusModal} onClose={() => setShowingAddStatusModal(false)}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-lg font-medium">
                        Ajouter un status
                    </h1>
                    <div className="form-control">
                        <InputLabel htmlFor="name" value="Nom du status*" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value})}
                            type="text"
                            className="w-full"
                            placeholder="Nom du status"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <InputLabel htmlFor="description" value="Description max: 255" />
                        <TextInput
                            id="description"
                            ref={description}
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value})}
                            type="text"
                            className="w-full"
                            placeholder="Description du status"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Valider
                    </button>
                </form>
            </Modal>
            <Toaster />
        </section>

    );


}