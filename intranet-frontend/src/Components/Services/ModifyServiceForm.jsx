import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

import CategorySelect from '@/Components/Category/CategorySelect';
import StatusSelect from '@/Components/Status/StatusSelect';
import UsersSelect from '@/Components/Users/UsersSelect';

import { editService } from '@/api/modules/services';

import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyServiceForm({ service, onClose, onSuccess }) {
    const name = useRef();
    const description = useRef();
    const internal_url = useRef();
    const external_url = useRef();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [data, setData] = useState({
        name: '',
        description: '',
        internal_url: '',
        external_url: '',
        image: '',
        categories: [],
        users: [],
        status: null,
    });

    const reset = () => {
        setData({
            name: '',
            description: '',
            internal_url: '',
            external_url: '',
            image: '',
            categories: [],
            users: [],
            status: null,
        });
        setSelectedCategories([]);
        setSelectedUsers([]);
        setSelectedStatus(null);
        setImageFile(null);
    };
 

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('internal_url', data.internal_url);
        formData.append('external_url', data.external_url);
        if (imageFile) {
            formData.append('image', imageFile); // Ajout du fichier
        }
        formData.append('category_id', JSON.stringify(selectedCategories.map(cat => cat.value)));
        formData.append('user_id', JSON.stringify(selectedUsers.map(user => user.value)));
        formData.append('status_id', selectedStatus?.value);

        toast.promise(
            editService(formData, service.id),
            {
                loading: 'Modification du service en cours ...',
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
                    Modifier un service
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
                        type="text"
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
                <button type="submit" className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
