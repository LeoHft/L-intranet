import NavLink from '@/Components/Utils/NavLink';
import SearchBar from '@/Components/Utils/SearchBar';

import { Link } from 'react-router-dom';
import { HouseWifi } from 'lucide-react';


export default function GuestLayout({ children }) {
    return (
        <div>
            <nav className="navbar">
                <div className="container mx-auto">
                    <div className="navbar-start">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link to="/" className="btn btn-ghost">
                                    <HouseWifi className="h-7 w-7" />
                                </Link>
                            </div>

                            <div className="hidden sm:flex">
                                <ul className="menu menu-horizontal px-1">
                                    <li>
                                        <NavLink
                                            to="/login"
                                            active={location.pathname === '/login'}
                                        >
                                            Connexion
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <SearchBar />
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
