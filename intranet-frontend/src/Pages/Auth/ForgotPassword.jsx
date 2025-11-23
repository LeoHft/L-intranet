import Layout from "@/Components/Utils/Layout";
import { useEffect } from "react";

export default function ForgotPassword() {
  useEffect(() => {
    document.title = "Forgot password - Intranet";
  }, []);

  return (
    <Layout>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="card bg-base-100/20 backdrop-blur-sm shadow-xl max-w-lg">
            <div className="card-body">
              <div className="text-lg opacity-70">
                Mot de passe oublié ? <br /> Pas de souci, demandez à votre
                administrateur de réinitialiser votre mot de passe.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
