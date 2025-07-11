import { getAllCategory } from '@/api/modules/category';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';


export default function CategorySelect({ selectedCategories, setSelectedCategories }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            getAllCategory()
            .then((response) => {
                setCategories(response.data.map((category) => ({
                    value: category.id,
                    label: category.name,
                })));
            })
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie(s)</label>
            {loading ? (
                <p className="text-sm text-gray-500">Chargement des catégories...</p>
            ) : (
                <Select
                    options={categories}
                    isMulti
                    className="mt-1 block w-full"
                    value={selectedCategories || []}
                    onChange={setSelectedCategories}
                    placeholder="Sélectionnez des catégories..."
                    styles={{
                        menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" })
                    }}
                />
            )}
        </div>
    );
}
