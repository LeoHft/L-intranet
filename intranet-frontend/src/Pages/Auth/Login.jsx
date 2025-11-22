import Checkbox from '@/Components/Utils/Checkbox';
import InputError from '@/Components/Utils/InputError';
import InputLabel from '@/Components/Utils/InputLabel';
import PrimaryButton from '@/Components/Utils/PrimaryButton';
import TextInput from '@/Components/Utils/TextInput';

import Layout from '@/Components/Utils/Layout';
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
        <Layout>
            <div className="hero min-h-screen"> 
                <form onSubmit={submit} className="card bg-base-100/10 backdrop-blur-sm shadow-xl max-w-96 w-full">
                    <div className="card-body space-y-6">
                        <div className="form-control">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="form-control">
                            <InputLabel htmlFor="password" value="Mot de passe" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="link link-hover text-sm opacity-80"
                            >
                                Mot de passe oublié ?
                            </Link>

                            <PrimaryButton className="ml-4 btn-gradient" disabled={isLoading}>
                                {isLoading ? 'Connexion...' : 'Connexion'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
            <Toaster />
        </Layout>
    );
}
