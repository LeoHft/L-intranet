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
                className="container mx-auto px-4 text-center pt-8 min-h-[500vh]"
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

                {/* SECTIONS */}
                <div className="grid md:grid-cols-3 gap-8 mt-30">
                    <div
                        className="card bg-base-100 border border-primary/20"
                        ref={el => sectionRefs.current[0] = el}
                    >
                        <div className="card-body">
                            <h3 className="card-title text-4xl font-serif text-left">
                                Gestion utilisateurs
                            </h3>
                            <p className="font-mono text-3xl text-left">
                                Créez des comptes utilisateurs et attribuez leurs des accès aux services selon les besoins.
                            </p>
                        </div>
                    </div>
                    <div
                        className="card bg-base-100 border border-primary/20 mt-50"
                        ref={el => sectionRefs.current[1] = el}
                    >
                        <div className="card-body">
                            <h3 className="card-title text-4xl font-serif">
                                Services organisés
                            </h3>
                            <p className="font-mono text-3xl">
                                Classez vos services par catégories, ajoutez des descriptions et statuts.
                            </p>
                        </div>
                    </div>
                    <div
                        className="card bg-base-100 border border-primary/20"
                        ref={el => sectionRefs.current[2] = el}
                    >
                        <div className="card-body">
                            <h3 className="card-title text-4xl font-serif text-right">
                                Accès centralisé
                            </h3>
                            <p className="font-mono text-3xl text-right">
                                Accédez à tous vos services depuis un seul endroit. Peu importe lesquels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
