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
        background: 'oklch(var(--b1))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: state.isFocused ? '2px solid oklch(var(--p))' : '1px solid oklch(var(--b3))',
        boxShadow: state.isFocused ? '0 0 0 2px oklch(var(--p) / 0.2)' : '0 1px 2px 0 oklch(var(--b3) / 0.3)',
        color: 'oklch(var(--bc))',
        minHeight: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        background: 'oklch(var(--b1))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 oklch(var(--b3) / 0.4)',
        border: '1px solid oklch(var(--b3))',
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected
            ? 'oklch(var(--p))'
            : state.isFocused
            ? 'oklch(var(--b2))'
            : 'transparent',
        color: state.isSelected ? 'oklch(var(--pc))' : 'oklch(var(--bc))',
        padding: '8px 12px',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'oklch(var(--bc))',
    }),
    multiValue: (provided) => ({
        ...provided,
        background: 'oklch(var(--b2))',
        border: '1px solid oklch(var(--b3))',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'oklch(var(--bc))',
        padding: '2px 6px',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'oklch(var(--bc))',
        ':hover': {
            backgroundColor: 'oklch(var(--er))',
            color: 'oklch(var(--erc))',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'oklch(var(--bc) / 0.6)',
    }),
};