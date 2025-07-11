import PrimaryButton from '@/Components/Utils/PrimaryButton';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import { storeCategory } from '@/api/modules/category';

import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function AddCategoryForm({ onCategoryAdded }) {
    const [showingAddCategoryModal, setShowingAddCategoryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const AddCategory = () => {
        setShowingAddCategoryModal(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!data.name.trim()) { // Si pas de texte, alors renvoie true
            toast.error('Le nom de la catégorie est requis');
            return;
        }

        setIsLoading(true);
        
        toast.promise(
            storeCategory(data),
            {
                loading: 'Ajout de la catégorie en cours...',
                success: (response) => {
                    reset();
                    setShowingAddCategoryModal(false);
                    setIsLoading(false);
                    return response.message;
                },
                error: (error) => {
                    setIsLoading(false);
                    return error.message;
                }
            }
        );
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
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`mt-4 px-4 py-2 rounded text-white ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {isLoading ? 'Ajout en cours...' : 'Valider'}
                    </button>
                    
                </form>
            </Modal>
            <Toaster />
        </section>

    );


}