import PrimaryButton from '@/Components/Utils/PrimaryButton';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import CategorySelect from '@/Components/Category/CategorySelect';
import StatusSelect from '@/Components/Status/StatusSelect';
import UsersSelect from '@/Components/Users/UsersSelect';
import { storeService } from '@/api/modules/services';

import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';


export default function AddServiceForm({ onServiceAdded }) {
    const [showingAddServiceModal, setShowingAddServiceModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const name = useRef();
    const description = useRef();
    const internal_url = useRef();
    const external_url = useRef();
    const image = useRef();
    const [data, setData] = useState({
        name: '',
        description: '',
        internal_url: '',
        external_url: '',
        image: '',
        categories: [],
        status: null,
        users: [], 
    });

    const reset = () => {
        setData({
            name: '',
            description: '',
            internal_url: '',
            external_url: '',
            image: '',
            categories: [],
            status: null,
            users: [], 
        });
        setSelectedCategories([]);
        setSelectedUsers([]);
        setSelectedStatus(null);
    };

    const AddService = () => {
        setShowingAddServiceModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation des utilisateurs obligatoires
        if (!selectedUsers || selectedUsers.length === 0) {
            toast.error('Veuillez sélectionner au moins un utilisateur');
            return;
        }
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('internal_url', data.internal_url);
        formData.append('external_url', data.external_url);
        formData.append('image', data.image);
        formData.append('category_id', JSON.stringify(selectedCategories.map(category => category.value)));
        formData.append('user_id', JSON.stringify(selectedUsers.map(user => user.value)));
        formData.append('status_id', selectedStatus?.value || '');
    
        toast.promise(
            storeService(formData),
            {
                loading: 'Ajout du service en cours ...',
                success: (response) => {
                    reset();
                    onServiceAdded();
                    setShowingAddServiceModal(false);
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
            <PrimaryButton onClick={AddService}> Ajouter un service </PrimaryButton>

            <Modal show={showingAddServiceModal} onClose={() => setShowingAddServiceModal(false)}>
                <div className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter un service
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom du service*" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value})}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nom du service"
                            required
                        />
                    </div>
                    <div>   
                        <InputLabel htmlFor="description" value="Description max: 255" />
                        <textarea
                            id="description"
                            ref={description}
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Description du service"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="internal_url" value="Url interne" />
                        <TextInput
                            id="internal_url"
                            ref={internal_url}
                            value={data.internal_url}
                            onChange={(e) => setData({ ...data, internal_url: e.target.value})}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Url interne"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="external_url" value="Url externe" />
                        <TextInput
                            id="external_url"
                            ref={external_url}
                            value={data.external_url}
                            onChange={(e) => setData({ ...data, external_url: e.target.value})}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Url externe"
                        />
                    </div>
                    <CategorySelect
                        selectedCategories={selectedCategories} 
                        setSelectedCategories={setSelectedCategories} 
                    />
                    <StatusSelect
                        selectedStatus={selectedStatus} 
                        setSelectedStatus={setSelectedStatus}
                    />
                    <UsersSelect
                        selectedUsers={selectedUsers} 
                        setSelectedUsers={setSelectedUsers}
                        required
                    />
                    <div>
                        <InputLabel htmlFor="image" value="Image*" />
                        <input
                            id="image"
                            type="file"
                            className="mt-1 block w-full hover:cursor-pointer"
                            onChange={(e) => setData({ ...data, image: e.target.files[0]})}
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                        Valider
                    </button>
                    
                </form>
                </div>
            </Modal>
            <Toaster />
        </section>

    );


}