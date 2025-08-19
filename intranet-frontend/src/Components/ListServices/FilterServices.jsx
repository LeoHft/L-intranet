import { getAllStatus } from '@/api/modules/status';
import { getAllCategory } from '@/api/modules/category';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';


export default function FilterServices({selectedCategories, setSelectedCategories, selectedStatus, setSelectedStatus}) {
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState([]);

    useEffect(() => {
        try {
            getAllStatus()
                .then((response) => {
                    setStatus(response.data.map((status) => ({
                        value: status.id,
                        label: status.name,
                    })));
                })
        } catch (error) {
            toast.error(error.message)
        }
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
        } 

    }, []);

return (
    <>
        <Toaster />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-end justify-end">
            <div className="form-control w-full min-w-[180px]">
                <label className="label-text font-medium">Statuts</label>
                <Select
                    options={status}
                    isMulti
                    className="w-full"
                    styles={{
                        ...glassStyles,
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }}
                    menuPortalTarget={document.body}
                    value={selectedStatus || null}
                    onChange={setSelectedStatus}
                    placeholder="Sélectionnez des statuts..."
                />
            </div>
            <div className="form-control w-full sm:min-w-[220px]">
                <label className="label-text font-medium">Catégories</label>
                <Select
                    options={categories}
                    isMulti
                    className="w-full"
                    styles={{
                        ...glassStyles,
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }}
                    menuPortalTarget={document.body}
                    value={selectedCategories || []}
                    onChange={setSelectedCategories}
                    placeholder="Sélectionnez des catégories..."
                />
            </div>
        </div>
    </>
)
}

// Styles custom pour effet liquid glass
const glassStyles = {
    control: (provided, state) => ({
        ...provided,
        background: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: state.isFocused ? '2px solid #f9a8d4' : '1px solid rgba(255,255,255,0.3)',
        boxShadow: state.isFocused ? '0 0 0 2px #f9a8d422' : '0 1px 2px 0 rgba(0,0,0,0.05)',
        color: '#111827',
    }),
    menu: (provided) => ({
        ...provided,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 rgba(249, 168, 212, 0.25)',
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected
            ? 'rgba(249,168,212,0.2)'
            : state.isFocused
            ? 'rgba(252,165,165,0.1)'
            : 'transparent',
        color: '#111827',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#111827',
    }),
    multiValue: (provided) => ({
        ...provided,
        background: 'rgba(252,165,165,0.12)',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#9f1239',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#9f1239',
        ':hover': {
            backgroundColor: '#f9a8d4',
            color: 'white',
        },
    }),
};