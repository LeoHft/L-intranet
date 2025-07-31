import { getAllServices } from '@/api/modules/services';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';


export default function ServiceSelect({ selectedService, setSelectedService, styles }) {
    const [servicesOptions, setServicesOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            getAllServices()
                .then((response) => {
                    setServicesOptions(response.data.map((services) => ({
                        value: services.id,
                        label: services.name,
                    })));
                })
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }

    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Services</label>
            {loading ? (
                <p className="text-sm text-gray-500">Chargement des services...</p>
            ) : (
                <Select
                    options={servicesOptions}
                    isMulti
                    isClearable
                    className="mt-1 block w-full"
                    value={selectedService || []}
                    onChange={setSelectedService}
                    placeholder="Sélectionnez un statut..."
                    styles={{
                        ...styles,
                        menu: base => ({ ...base, zIndex: 9999 }),
                    }}
                />
            )}
        </div>
    );
}
