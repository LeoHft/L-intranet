import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import Layout from "@/Components/Utils/Layout";
import { AUTH_TOKEN_KEY } from "@/api/apiClient";
import { login } from "@/api/modules/users";
import { useAuthAttributes } from "@/context/AuthAttributsContext";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const authContext = useAuthAttributes();
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Connexion - Intranet";
  }, []);

  const signIn = async () => {
    const response = await login(data);
    localStorage.setItem(AUTH_TOKEN_KEY, response.data);
    await authContext.FetchUserAttributes();
    navigate("/dashboard");
    return response.message;
  };

  const submit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.promise(
      signIn().finally(() => setIsLoading(false)),
      {
        loading: "Connexion en cours",
        success: (message) => message,
        error: (error) => {
          setData((prev) => ({ ...prev, password: "" }));
          return error.message;
        },
      }
    );
  };

  return (
    <Layout>
      <div className="hero min-h-screen">
        <form
          onSubmit={submit}
          className="card bg-base-100/10 backdrop-blur-sm shadow-xl max-w-96 w-full"
        >
          <div className="card-body space-y-6">
            <div className="form-control">
              <InputLabel htmlFor="email" value="Email" />
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="username"
                autoFocus
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="form-control">
              <InputLabel htmlFor="password" value="Mot de passe" />
              <input
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="current-password"
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="link link-hover text-sm opacity-80">
                Mot de passe oublié ?
              </Link>

              <PrimaryButton className="ml-4 btn-gradient" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Connexion"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
