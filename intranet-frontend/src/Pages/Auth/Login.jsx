import Checkbox from '@/Components/Utils/Checkbox';
import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import GuestLayout from '@/Layouts/GuestLayout';
import { login, getCurrentUserInfo } from '@/api/modules/users'

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    // Gestion du titre de la page
    useEffect(() => {
        document.title = "Connexion - Intranet";
    }, []);


    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});


        toast.promise(
            login(data),
            {
                loading: 'Connexion en cours',
                success: (response) => {
                    localStorage.setItem('auth_token', response.data);
                    getCurrentUserInfo();
                    setData(prev => ({ ...prev, password: '' }));
                    setIsLoading(false);
                    window.location.href = '/dashboard';
                    return response.message;
                },
                error: (error) => {
                    setData(prev => ({ ...prev, password: '' }));
                    setIsLoading(false);
                    return error.message;
                }
            }
        );
    };

    return (
        <GuestLayout>
            <div className="flex items-center justify-center min-h-screen"> 
                <form onSubmit={submit} className="rounded-md shadow-xl p-6 max-w-96 mx-auto w-full bg-white/10 backdrop-blur-sm">
                   
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Mot de passe" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Si besoin, modifier le backend pour y inclure le remember */}
                    {/* <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData({ ...data, remember: e.target.checked })
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Se souvenir de moi
                            </span>
                        </label>
                    </div> */}

                    <div className="mt-4 flex items-center justify-end">
                        <Link
                            to="/forgot-password"
                            className="rounded-md text-sm text-white/80 underline hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Mot de passe oublié ?
                        </Link>

                        <PrimaryButton className="ms-4 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" disabled={isLoading}>
                            {isLoading ? 'Connexion...' : 'Connexion'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            <Toaster />
        </GuestLayout>
    );
}
