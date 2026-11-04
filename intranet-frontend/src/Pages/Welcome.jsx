import Layout from "@/Components/Utils/Layout";
import SearchBar from "@/Components/Utils/SearchBar";

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  useEffect(() => {
    document.title = "Bienvenue - Intranet";
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 text-center">
        {/* HERO */}
        <div className="hero min-h-[calc(100dvh-8rem)]">
          <div className="hero-content text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold font-serif">Intranet</h1>
              <p className="text-xl sm:text-2xl font-light font-serif opacity-70">
                Centralisez vos services auto-hébergés, gérez les accès avec
                finesse.
              </p>
              <Link id="buttonLogin" to="/dashboard" className="btn btn-primary btn-lg">
                Accédez à votre intranet
              </Link>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
