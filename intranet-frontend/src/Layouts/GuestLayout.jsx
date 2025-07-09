import NavLink from '@/Components/Utils/NavLink';

import { Link } from 'react-router-dom';
import { HouseWifi } from 'lucide-react';


export default function GuestLayout({ children }) {
    return (
                <div className="bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-center">
                    <nav>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex shrink-0 items-center">
                                        <Link to="/">
                                            <HouseWifi className="h-7 w-7" />
                                        </Link>
                                    </div>
        
                                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                        <NavLink
                                            href="/login"
                                            active={window.location.pathname === '/login'}
                                        >
                                            Connexion
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main>{children}</main>
                </div>
    );
}
