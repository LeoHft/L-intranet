import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import { updateCategory } from '@/api/modules/category';

import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyCategoryForm({ category, onClose }) {
    const [showingModifyCategoryModal, setShowingModifyCategoryModal] = useState(true);
    const name = useRef();
    const description = useRef();
    const [data, setData] = useState({
        name: '',
        description:'',
    })

    const reset = () => {
        setData({
            name: '',
            description: '',
        });
    }

    useEffect(() => {
        if (category) {
            setData({
                name: category.name || '',
                description: category.description || '',
            });
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast.error('Le nom de la catégorie est requis');
            return;
        }

        toast.promise(
            updateCategory(data, category.id),
            {
                loading: 'Modification de la catégorie en cours ...',
                success: (response) => {
                    reset();
                    setShowingModifyCategoryModal(false);
                    return response.message;
                },
                error: (error) => {
                    return error.message;
                }
            }
        );
    };

    return (
        <Modal show={showingModifyCategoryModal} onClose={() => { setShowingModifyCategoryModal(false); onClose(); }}>
            <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier une catégorie
                </h1>
                <div>
                    <InputLabel htmlFor="name" value="Nom de la catégorie*" />
                    <TextInput
                        id="name"
                        ref={name}
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
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
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Description de la catégorie"
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
