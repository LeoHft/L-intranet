import Layout from "@/Components/Utils/Layout";
import SearchBar from "@/Components/Utils/SearchBar";

import React, { useRef, useEffect } from "react";

export default function Welcome() {
  const container = useRef();
  const sectionRefs = useRef([]);

  // Gestion du titre de la page
  useEffect(() => {
    document.title = "Bienvenue - Intranet";
  }, []);

  return (
    <Layout>
      <div ref={container} className="container mx-auto px-4 text-center">
        {/* HERO */}
        <div className="hero min-h-[calc(100vh-5rem)]">
          <div className="hero-content text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-6xl font-bold font-serif">Intranet</h1>
              <p className="text-2xl font-light font-serif opacity-70">
                Centralisez vos services auto-hébergés, gérez les accès avec
                finesse.
              </p>
              <button
                id="buttonLogin"
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="btn btn-primary btn-lg"
              >
                Accédez à votre intranet
              </button>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
