import { getAllStatus } from '@/api/modules/status';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';


export default function StatusSelect({ selectedStatus, setSelectedStatus }) {
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            getAllStatus()
                .then((response) => {
                    setStatusOptions(response.data.map((status) => ({
                        value: status.id,
                        label: status.name,
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
            <label className="label-text">Statut</label>
            {loading ? (
                <p className="text-sm opacity-70">Chargement des statuts...</p>
            ) : (
                <Select
                    options={statusOptions}
                    className="w-full"
                    value={selectedStatus || null}
                    onChange={setSelectedStatus}
                    placeholder="Sélectionnez un statut..."
                    styles={{
                        menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" })
                    }}
                />
            )}
        </div>
    );
}
