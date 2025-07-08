import PrimaryButton from '@/Components/Utils/PrimaryButton';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import {useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';


export default function AddCategoryForm() {
    const [showingAddCategoryModal, setShowingAddCategoryModal] = useState(false);
    const name = useRef();
    const description = useRef();


    const {
        data,
        setData,
        reset,
    } = useForm({
        name: '',
        description: '',
    });

    const AddCategory = () => {
        setShowingAddCategoryModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/storeCategory', {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            reset();
            setShowingAddCategoryModal(false);
            toast.success('Catégorie ajoutée avec succès');
        }).catch(error => {
            console.error("Error adding Category:", error);
            toast.error('Erreur lors de l\'ajout de la catégorie');
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddCategory}> Ajouter une catégorie </PrimaryButton>

            <Modal show={showingAddCategoryModal} onClose={() => setShowingAddCategoryModal(false)}>
                <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter une catégorie
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom de la catégorie*" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nom de la catégorie"
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
                            placeholder="Description de la catégorie"
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