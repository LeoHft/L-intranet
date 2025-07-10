import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

import { useEffect } from 'react';


export default function Edit({ mustVerifyEmail, status }) {
    useEffect(() => {
        document.title = "AdminDashboard - Intranet";
    }, []);
    return (
        <AuthenticatedLayout>
            <h2 className="text-xl font-semibold leading-tight text-gray-800 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                    Profile
                </h2>
            <div className="py-5">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div>
                        <UpdatePasswordForm/>
                    </div>

                    <div>
                        <DeleteUserForm/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
