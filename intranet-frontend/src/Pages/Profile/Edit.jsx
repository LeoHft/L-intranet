import Layout from '@/Components/Utils/Layout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ThemeSettings from '@/Components/Utils/ThemeSettings';

import { useEffect } from 'react';


export default function Edit({ mustVerifyEmail, status }) {
    useEffect(() => {
        document.title = "AdminDashboard - Intranet";
    }, []);
    return (
        <Layout>
            <h2 className="text-xl font-semibold leading-tight mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                    Profile
                </h2>
            <div className="py-5">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <ThemeSettings />
                    </div>
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

                </div>
            </div>
        </Layout>
    );
}
