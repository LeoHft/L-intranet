import NavLink from '@/Components/Utils/NavLink';
import SearchBar from '@/Components/Utils/SearchBar';

import { Link } from 'react-router-dom';
import { HouseWifi } from 'lucide-react';


export default function GuestLayout({ children }) {
    return (
        <div className="bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-center">
            <nav>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link to="/">
                                    <HouseWifi className="h-7 w-7" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    to="/login"
                                    active={location.pathname === '/login'}
                                >
                                    Connexion
                                </NavLink>
                            </div>
                        </div>
                        <div className="ms-auto">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
