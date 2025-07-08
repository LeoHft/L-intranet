import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardServices from '@/Components/ListServices/CardServices';

import { usePage, Head } from '@inertiajs/react';


export default function Dashboard({}) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <Head title="Dashboard" />
            <p className="font-serif text-3xl ">Bonjour, </p>
            <p className="font-serif text-2xl" > {user.name} </p>
            <CardServices />
        </div>
        </AuthenticatedLayout>
    );
}