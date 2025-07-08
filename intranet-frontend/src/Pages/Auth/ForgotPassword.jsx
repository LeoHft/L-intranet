import GuestLayout from '@/Layouts/GuestLayout';

import { Head, useForm } from '@inertiajs/react';


export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="flex items-center justify-center min-h-screen">
                <div className="mb-4 text-ml text-gray-600 max-w-lg text-center justify-center mx-auto block w-full rounded-md shadow-xl p-6">
                    Mot de passe oublié ? Pas de souci. Indiquez-nous votre adresse e-mail et nous vous enverrons un lien de réinitialisation du mot de passe qui vous permettra d'en choisir un nouveau. Non c'est faux j'ai toujours pas de serveur SMTP donc demandez moi de réinitialiser votre mot de passe.
                </div>
            </div>
        </GuestLayout>
    );
}
