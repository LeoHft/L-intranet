import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import CategorySelect from '@/Components/Category/CategorySelect';
import StatusSelect from '@/Components/Status/StatusSelect';
import UsersSelect from '@/Components/Users/UsersSelect';

import { useEffect, useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyServiceForm({ service, onClose }) {
    const [showingModifyServiceModal, setShowingModifyServiceModal] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const { data, setData, reset } = useForm({
        name: '',
        description: '',
        internal_url: '',
        external_url: '',
        image: '',
        categories: [],
        users: [],
        status: null,
    });

    useEffect(() => {
        if (service) {
            setData({
                name: service.name || '',
                description: service.description || '',
                internal_url: service.internal_url || '',
                external_url: service.external_url || '',
                image: service.image_url || '',
                categories: service.categories?.map(cat => ({ value: cat.id, label: cat.name })) || [],
                users: service.users?.map(user => ({ value: user.id, label: user.name })) || [],
                status: service.status ? { value: service.status.id, label: service.status.name } : null,
            });
    
            setSelectedCategories(service.categories?.map(cat => ({ value: cat.id, label: cat.name })) || []);
            setSelectedUsers(service.users?.map(user => ({ value: user.id, label: user.name })) || []);
            setSelectedStatus(service.status ? { value: service.status.id, label: service.status.name } : null);
        }
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();   
        const formData = new FormData();
        formData.append('_method', 'PUT'); 
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('internal_url', data.internal_url);
        formData.append('external_url', data.external_url);
        if (imageFile) {
            formData.append('image', imageFile); // Ajout du fichier
        }
        formData.append('category_id', JSON.stringify(selectedCategories.map(cat => cat.value)));
        formData.append('user_id', JSON.stringify(selectedUsers.map(user => user.value)));
        formData.append('status_id', selectedStatus?.value || '');
    
        try {
            await axios.post(`/api/updateService/${service.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            toast.success('Service modifié avec succès');
            reset();
            setShowingModifyServiceModal(false);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la modification du service:", error);
            toast.error('Erreur lors de la modification du service');
        }
    };
    

    return (
        <Modal show={showingModifyServiceModal} onClose={() => { setShowingModifyServiceModal(false); onClose(); }}>
            <div className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier un service
                </h1>
                <div>
                    <InputLabel htmlFor="name" value="Nom du service*" />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
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
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Description du service"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="internal_url" value="Url interne" />
                    <TextInput
                        id="internal_url"
                        value={data.internal_url}
                        onChange={(e) => setData('internal_url', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Url interne"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="external_url" value="Url externe" />
                    <TextInput
                        id="external_url"
                        value={data.external_url}
                        onChange={(e) => setData('external_url', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="URL externe"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="image" value="Image" />
                    {data.image && (
                        <div className="mt-2">
                            <p>Image actuelle :</p>
                            <img src={data.image} alt="Aperçu" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                    <input
                        id="image"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setImageFile(e.target.files[0])}
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
                />
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            </div>
            <Toaster />
        </Modal>
    );
}
