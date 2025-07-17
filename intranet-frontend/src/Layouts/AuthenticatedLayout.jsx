import { ToggleContext } from '@/Components/Utils/ToggleContext';
import ToggleSwitch from '@/Components/Utils/ToggleSwitch';
import Dropdown from '@/Components/Utils/Dropdown';
import NavLink from '@/Components/Utils/NavLink';
import ResponsiveNavLink from '@/Components/Utils/ResponsiveNavLink';

import { useAuthAttributes } from '@/context/AuthAttributsContext';
import { logout } from '@/api/modules/users';
import SearchBar from '@/Components/Utils/SearchBar';

import { useState, useEffect } from 'react';
import { HouseWifi } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


export default function AuthenticatedLayout({ header, children }) {
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;
    const location = useLocation();
    const navigate = useNavigate();

    const [enabled, setEnabled] = useState(() => localStorage.getItem('enabled') === 'true');

    useEffect(() => {
        localStorage.setItem('enabled', enabled);
    }, [enabled]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const handleLogout = async () => {
        toast.promise(
            logout(),
            {
                loading: 'Déconnexion en cours...',
                success: (response) => {
                    // Réinitialiser le contexte d'authentification
                    if (authContext?.FetchUserAttributes) {
                        authContext.FetchUserAttributes();
                    }
                    
                    navigate('/login');
                    return response.message;
                },
                error: (error) => {
                    // Réinitialiser le contexte d'authentification
                    if (authContext?.FetchUserAttributes) {
                        authContext.FetchUserAttributes();
                    }
                    navigate('/login');
                    return error.message;
                }
            }
        );
    };

    return (
        <ToggleContext.Provider value={{ enabled, setEnabled }}>
        <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-center">
            <nav className="border-b border-transparent">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link to="/">
                                    <HouseWifi className="h-7 w-7 hover:animate-bounce" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex ">
                                <NavLink
                                    to="/dashboard"
                                    active={location.pathname === '/dashboard'}
                                >
                                    Menu
                                </NavLink>
                            </div>
                            {user.is_admin ? (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        to="/adminDashboard"
                                        active={location.pathname === '/adminDashboard'}
                                    >
                                        Menu Administrateur
                                    </NavLink>
                                </div>
                            ) : null}
                        </div>
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <SearchBar/>
                            {user.is_admin ? (
                                <ToggleSwitch />
                            ) : null}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            to="/profile/edit"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                        >
                                            Déconnexion
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            to="/dashboard"
                            active={location.pathname === '/dashboard'}
                        >
                            Menu
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink to="/profile/edit">
                                Profile
                            </ResponsiveNavLink>
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <Toaster />
        </div>
        </ToggleContext.Provider>
    );
}
