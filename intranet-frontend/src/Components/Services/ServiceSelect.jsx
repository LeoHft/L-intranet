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
        <div className="form-control">
            <label className="label-text font-medium">Services</label>
            {loading ? (
                <p className="text-sm text-base-content/70">Chargement des services...</p>
            ) : (
                <Select
                    options={servicesOptions}
                    isMulti
                    isClearable
                    className="w-full"
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
