import { useAuthAttributes } from '@/context/AuthAttributsContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardServices from '@/Components/ListServices/CardServices';

import { useEffect } from 'react';


export default function Dashboard({}) {
    useEffect(() => {
        document.title = "Dashboard - Intranet";
    }, []);
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;

    return (
        <AuthenticatedLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <p className="font-serif text-3xl ">Bonjour, </p>
            <p className="font-serif text-2xl" > {user.name} </p>
            <CardServices />
        </div>
        </AuthenticatedLayout>
    );
}