import { HouseWifi, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ToggleSwitch from '@/Components/Utils/ToggleSwitch';
import NavLink from '@/Components/Utils/NavLink';
import ListShortcuts from '@/Components/Utils/ListShortcuts';
import SearchBar from '@/Components/Utils/SearchBar';
import { useAuthAttributes } from '@/context/AuthAttributsContext';
import { logout } from '@/api/modules/users';


export default function AuthenticatedLayout({ children }) {
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;
    const isLogin = user.connected || false;
    const location = useLocation();
    const navigate = useNavigate();
    const isWelcomePage = location.pathname === '/';

    const handleLogout = async () => {        
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

    return (         
        <>  
            <div className="min-h-screen relative">
                {/* Navigation principale */}
                <nav className="navbar sticky top-0 bg-base-200/20 backdrop-blur-sm z-50">
                    <div className="container mx-auto">
                        <div className="navbar-start">
                            {/* Logo et navigation desktop */}
                            <div className="flex items-center">
                                    <div className="hidden md:flex">
                                        <ul className="menu menu-horizontal flex items-end">
                                            <li>
                                                <Link to="/" className="btn btn-ghost">
                                                    <HouseWifi className="h-7 w-7 hover:animate-bounce" />
                                                </Link>
                                            </li>
                                        {isLogin && !isWelcomePage ? (
                                            <>
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
                                            <li>
                                                <div className="dropdown dropdown-end">
                                                    <div tabIndex={0} className="text-base-content/90 font-medium flex flex-row"><User className="h-5 w-5 pr-1" /><p className="capitalize">{user?.name}</p></div>
                                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg">
                                                        <li>
                                                            <NavLink
                                                                to="/profile/edit"
                                                                className="btn btn-ghost w-full justify-start text-left"
                                                            >
                                                                Modifier le profil
                                                            </NavLink>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="btn btn-ghost w-full justify-start text-left text-error"
                                                            >
                                                                Déconnexion
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                            </>
                                        ) : !isLogin ? (
                                            <li>
                                                <NavLink
                                                    to="/login"
                                                    active={location.pathname === '/login'}
                                                >
                                                    Connexion
                                                </NavLink>
                                            </li>
                                        ) : null}
                                        </ul>
                                    </div>
                            </div>
                        </div>
                        
                        <div className="navbar-end">
                            {/* Actions utilisateur desktop */}
                            <div className="flex gap-3">
                                {isLogin ? (
                                    <ListShortcuts />                                
                                ) : null}
                                {user?.is_admin && !isWelcomePage ? (
                                    <ToggleSwitch />
                                ) : null}
                                {isLogin && !isWelcomePage ? (
                                    <SearchBar />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Contenu principal */}
                <main className="container mx-auto relative px-3 py-6">
                    {children}
                </main>     
            </div>       
            <Toaster/>
        </>
    );
}