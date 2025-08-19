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
            <div />
            
            <div className="min-h-screen relative">
                {/* Navigation principale */}
                <nav className="navbar sticky top-0 z-50 bg-base-200/20 backdrop-blur-sm">
                    <div className="container mx-auto">
                        <div className="navbar-start">
                            {/* Logo et navigation desktop */}
                            <div className="flex items-center space-x-4 sm:space-x-8">
                                <Link to="/" className="btn btn-ghost">
                                    <HouseWifi className="h-7 w-7 hover:animate-bounce" />
                                </Link>

                                {/* Navigation desktop */}
                                <div className="hidden md:flex">
                                    <ul className="menu menu-horizontal px-1">
                                        <li>
                                            <NavLink
                                                to="/dashboard"
                                                active={location.pathname === '/dashboard'}
                                                className="text-base-content/90 font-medium"
                                            >
                                                Menu
                                            </NavLink>
                                        </li>
                                        {user?.is_admin ? (
                                            <li>
                                                <NavLink
                                                    to="/adminDashboard"
                                                    active={location.pathname === '/adminDashboard'}
                                                    className="text-base-content/90 font-medium"
                                                >
                                                    Admin
                                                </NavLink>
                                            </li>
                                        ) : null}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="navbar-end">
                            {/* Actions utilisateur desktop */}
                            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                                <div className="max-w-xs lg:max-w-sm">
                                    <SearchBar />
                                </div>
                                
                                {user?.is_admin ? (
                                    <div className="hidden sm:flex sm:items-center">
                                        <ToggleSwitch />
                                    </div>
                                ) : null}
                                
                                <div className="dropdown dropdown-end">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="btn btn-ghost bg-base-200/20 backdrop-blur-sm"
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

                                        <Dropdown.Content className="dropdown-content menu bg-base-100 rounded-box shadow">
                                            <Dropdown.Link
                                                to="/profile/edit"
                                                className="btn btn-ghost w-full justify-start text-left"
                                            >
                                                Profil
                                            </Dropdown.Link>
                                            <button
                                                onClick={handleLogout}
                                                className="btn btn-ghost w-full justify-start text-left"
                                            >
                                                Déconnexion
                                            </button>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            {/* Bouton menu mobile */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="btn btn-ghost"
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
                    
                        className={`md:hidden drawer-side ${
                            showingNavigationDropdown 
                                ? 'max-h-screen opacity-100 visible' 
                                : 'max-h-0 opacity-0 invisible overflow-hidden'
                        }`}
                    >
                        <div className="menu bg-base-100 p-4 space-y-6">
                            {/* Informations utilisateur */}
                            <div className="pb-4 border-b border-base-300">
                                <div className="flex items-center space-x-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                                            <span className="text-sm font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-sm opacity-70 truncate">
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
                                    className="btn btn-ghost w-full justify-start"
                                >
                                    <span className="ml-1">Menu Principal</span>
                                </ResponsiveNavLink>
                                
                                {user?.is_admin ? (
                                    <ResponsiveNavLink
                                        to="/adminDashboard"
                                        active={location.pathname === '/adminDashboard'}
                                        className="btn btn-ghost w-full justify-start"
                                    >
                                        <span className="ml-1">Administration</span>
                                    </ResponsiveNavLink>
                                ) : null}
                            </div>

                            {/* Toggle admin pour mobile */}
                            {user?.is_admin ? (
                                <div className="card bg-base-200 p-3">
                                    <ToggleSwitch />
                                </div>
                            ) : null}

                            {/* Actions utilisateur mobile */}
                            <div className="space-y-2 pt-4 border-t border-base-300">
                                <ResponsiveNavLink 
                                    to="/profile/edit"
                                    className="btn btn-ghost w-full justify-start"
                                >
                                    <span className="ml-1">Mon Profil</span>
                                </ResponsiveNavLink>
                                
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-ghost w-full justify-start text-error"
                                >
                                    <span className="ml-1">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Header conditionnel */}
                {header && (
                    <header className="bg-base-100/90 backdrop-blur-sm shadow-sm relative z-40">
                        <div className="container mx-auto px-4 py-6">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenu principal */}
                <main className="container mx-auto relative z-30 px-3 py-6">
                    {children}
                </main>

            </div>
            
            <Toaster />
        </ToggleContext.Provider>
    );
}