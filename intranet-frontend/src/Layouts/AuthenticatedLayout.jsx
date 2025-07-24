import { ToggleContext } from '@/Components/Utils/ToggleContext';
import ToggleSwitch from '@/Components/Utils/ToggleSwitch';
import Dropdown from '@/Components/Utils/Dropdown';
import NavLink from '@/Components/Utils/NavLink';
import ResponsiveNavLink from '@/Components/Utils/ResponsiveNavLink';

import { useAuthAttributes } from '@/context/AuthAttributsContext';
import { logout } from '@/api/modules/users';
import SearchBar from '@/Components/Utils/SearchBar';

import { useState, useEffect } from 'react';
import { HouseWifi, Menu, X } from 'lucide-react';
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
        // Ferme le menu mobile lors de la déconnexion
        setShowingNavigationDropdown(false);
        
        toast.promise(
            logout(),
            {
                loading: 'Déconnexion en cours...',
                success: (response) => {
                    if (authContext?.FetchUserAttributes) {
                        authContext.FetchUserAttributes();
                    }
                    navigate('/login');
                    return response.message;
                },
                error: (error) => {
                    if (authContext?.FetchUserAttributes) {
                        authContext.FetchUserAttributes();
                    }
                    navigate('/login');
                    return error.message;
                }
            }
        );
    };

    // Ferme le menu mobile lors du changement de route
    useEffect(() => {
        setShowingNavigationDropdown(false);
    }, [location.pathname]);

    return (
        <ToggleContext.Provider value={{ enabled, setEnabled }}>
            {/* Fond d'écran fixe pour éviter les conflits avec les modals */}
            <div 
                className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-center"
                style={{ zIndex: -1 }}
            />
            
            <div className="min-h-screen relative">
                {/* Navigation principale */}
                <nav className="sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                        <div className="flex h-16 sm:h-18 justify-between items-center">
                            {/* Logo et navigation desktop */}
                            <div className="flex items-center space-x-4 sm:space-x-8">
                                <Link to="/">
                                    <HouseWifi className="h-7 w-7 hover:animate-bounce" />
                                </Link>

                                {/* Navigation desktop */}
                                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                                    <NavLink
                                        to="/dashboard"
                                        active={location.pathname === '/dashboard'}
                                        className="text-white/90 font-medium transition-colors duration-200"
                                    >
                                        Menu
                                    </NavLink>
                                    {user?.is_admin && (
                                        <NavLink
                                            to="/adminDashboard"
                                            active={location.pathname === '/adminDashboard'}
                                            className="text-white/90 font-medium transition-colors duration-200 text-sm lg:text-base"
                                        >
                                            Admin
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                            
                            {/* Actions utilisateur desktop */}
                            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                                <div className="max-w-xs lg:max-w-sm">
                                    <SearchBar />
                                </div>
                                
                                {user?.is_admin && (
                                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                        <ToggleSwitch />
                                    </div>
                                )}
                                
                                <div className="relative flex-shrink-0">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="flex items-center rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                                            >
                                                <span className="max-w-[100px] lg:max-w-none truncate">
                                                    {user?.name}
                                                </span>
                                                <svg
                                                    className="ml-2 h-4 w-4 transition-transform duration-200"
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
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="mt-2 backdrop-blur-md bg-white/95 border border-white/20 shadow-xl">
                                            <Dropdown.Link
                                                to="/profile/edit"
                                                className="text-gray-700 hover:bg-gray-100/80 transition-colors duration-200"
                                            >
                                                Profil
                                            </Dropdown.Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100/80 focus:bg-gray-100/80 focus:outline-none"
                                            >
                                                Déconnexion
                                            </button>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            {/* Bouton menu mobile */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center rounded-lg p-2 text-white/90 transition-all duration-200 hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white focus:outline-none active:scale-95"
                                    aria-expanded={showingNavigationDropdown}
                                    aria-label="Menu principal"
                                >
                                    {showingNavigationDropdown ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu mobile avec animation */}
                    <div
                    
                        className={`md:hidden transition-all duration-300 ease-in-out backdrop-blur-md bg-white/95 border-t border-white/20 ${
                            showingNavigationDropdown 
                                ? 'max-h-screen opacity-100 visible' 
                                : 'max-h-0 opacity-0 invisible overflow-hidden'
                        }`}
                    >
                        <div className="px-4 py-6 space-y-6">
                            {/* Informations utilisateur */}
                            <div className="pb-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-gray-900 truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Barre de recherche mobile */}
                            <div>
                                <SearchBar />
                            </div>

                            {/* Navigation mobile */}
                            <div className="space-y-2">
                                <ResponsiveNavLink
                                    to="/dashboard"
                                    active={location.pathname === '/dashboard'}
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/80 transition-colors duration-200"
                                >
                                    <span className="ml-1">Menu Principal</span>
                                </ResponsiveNavLink>
                                
                                {user?.is_admin && (
                                    <ResponsiveNavLink
                                        to="/adminDashboard"
                                        active={location.pathname === '/adminDashboard'}
                                        className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/80 transition-colors duration-200"
                                    >
                                        <span className="ml-1">Administration</span>
                                    </ResponsiveNavLink>
                                )}
                            </div>

                            {/* Toggle admin pour mobile */}
                            {user?.is_admin && (
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                    <ToggleSwitch />
                                </div>
                            )}

                            {/* Actions utilisateur mobile */}
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <ResponsiveNavLink 
                                    to="/profile/edit"
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/80 transition-colors duration-200"
                                >
                                    <span className="ml-1">Mon Profil</span>
                                </ResponsiveNavLink>
                                
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50"
                                >
                                    <span className="ml-1">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Header conditionnel */}
                {header && (
                    <header className="bg-white/90 backdrop-blur-sm shadow-sm relative z-40">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenu principal */}
                <main className="relative z-30 px-3 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>

            </div>
        </ToggleContext.Provider>
    );
}