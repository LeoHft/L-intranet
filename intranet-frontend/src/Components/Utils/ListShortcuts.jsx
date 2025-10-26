import * as Icons from 'lucide-react';
import Shortcut from '@/Components/Utils/Shortcut';
import { getUserShortcuts, addShortcut, deleteShortcut } from '@/api/modules/shortcut';
import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Utils/Modal';
import InputLabel from '@/Components/Utils/InputLabel';
import TextInput from '@/Components/Utils/TextInput';

export default function ListShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [showAddShortcut, setShowAddShortcut] = useState(false);
    const [newShortcut, setNewShortcut] = useState({ url: '', icon: '' });
    const [iconSearch, setIconSearch] = useState('');

    useEffect(() => {
        fetchShortcuts();
    }, []);

    const fetchShortcuts = () => {
        getUserShortcuts()
        .then((response) => {
            setShortcuts(response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des shortcuts:", error);
        });
    };

    const showAddShortcutForm = () => {
        setShowAddShortcut(true);
    };

    const handleAddShortcut = (e) => {
        e.preventDefault();

        addShortcut(newShortcut)
            .then((response) => {
                setShortcuts([...shortcuts, response.data]);
                setNewShortcut({ url: '', icon: '' });
                setShowAddShortcut(false);
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout du shortcut:", error);
            });
    };

    const handleDeleteShortcut = (id) => {
        deleteShortcut(id)
            .then(() => {
                setShortcuts(shortcuts.filter(shortcut => shortcut.id !== id));
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression du shortcut:", error);
            });
    };

    
    // Récupérer toutes les icônes disponibles
    const availableIcons = Object.keys(Icons).filter(key => 
        key !== 'createLucideIcon' && key !== 'default'
    );

    // Filtrer les icônes selon la recherche
    const filteredIcons = availableIcons.filter(iconName =>
        iconName.toLowerCase().includes(iconSearch.toLowerCase())
    );

    return (
        <>
        <div className="flex items-center gap-2">
            {shortcuts && shortcuts.length > 0 && (
                shortcuts.map(shortcut => (
                    <Shortcut 
                        key={shortcut.id} 
                        id={shortcut.id}
                        url={shortcut.url} 
                        icon={shortcut.icon}
                        onDelete={handleDeleteShortcut}
                    />
                ))
            )}

            {shortcuts && shortcuts.length < 10 && (
                <button className="btn btn-circle" onClick={showAddShortcutForm}>
                    +
                </button>
            )}
        </div>

            {showAddShortcut && (
                <Modal show={showAddShortcut} onClose={() => setShowAddShortcut(false)}>
                    <form onSubmit={handleAddShortcut} className="space-y-4">
                        <h1 className="text-lg font-medium">
                            Ajouter un shortcut
                        </h1>
                        <div className="form-control">
                            <InputLabel htmlFor="url" value="Lien du shortcut*" />
                            <TextInput
                                id="url"
                                value={newShortcut.url}
                                onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value})}
                                type="url"
                                className="w-full"
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                        <div className="form-control">   
                            <InputLabel htmlFor="icon" value="Icône*" />
                            <TextInput
                                id="icon-search"
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                                type="text"
                                className="w-full mb-2"
                                placeholder="Rechercher une icône..."
                            />
                            <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                                {filteredIcons.slice(0, 48).map((iconName) => {
                                    const IconComponent = Icons[iconName];
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setNewShortcut({ ...newShortcut, icon: iconName })}
                                            className={`p-2 rounded hover:bg-gray-200 flex flex-col items-center ${
                                                newShortcut.icon === iconName ? 'bg-blue-200' : ''
                                            }`}
                                            title={iconName}
                                        >
                                            <IconComponent size={24} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!newShortcut.icon}>
                            Ajouter
                        </button>
                    </form>
                </Modal>
            )}
        </>
    );
}