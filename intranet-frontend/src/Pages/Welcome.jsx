import GuestLayout from '@/Layouts/GuestLayout';

import React, { useRef, useEffect } from 'react';


export default function Welcome() {
    const container = useRef();
    const sectionRefs = useRef([]);

    // Gestion du titre de la page
    useEffect(() => {
        document.title = "Bienvenue - Intranet";
    }, []);

    return (
        <GuestLayout>
            <div
                ref={container}
                className="container mx-auto px-4 text-center pt-8 min-h-screen"
            >
                {/* HERO */}
                <div className="hero min-h-screen">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-6xl font-bold font-serif">Intranet</h1>
                            <p className="text-2xl font-light font-serif opacity-70 py-6">
                                Centralisez vos services auto-hébergés, gérez les accès avec finesse.
                            </p>
                            <p className="text-xl opacity-50 font-mono">Par HOFSTETTER Léo</p>
                            <button
                                id="buttonLogin"
                                type="button"
                                onClick={() => window.location.href = "/login"}
                                className="btn btn-primary btn-lg mt-10"
                            >
                                Accédez à votre intranet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
