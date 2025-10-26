import NavLink from '@/Components/Utils/NavLink';
import Shortcut from '@/Components/Utils/Shortcut';
import { Link } from 'react-router-dom';
import { HouseWifi, MessageSquare, Github, Youtube  } from 'lucide-react';
import ListShortcuts from '@/Components/Utils/ListShortcuts';


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
                        <div className="flex items-center gap-2">
                            <ListShortcuts />
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
