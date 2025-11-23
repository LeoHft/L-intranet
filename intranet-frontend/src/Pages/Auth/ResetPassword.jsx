import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import TextInput from "@/Components/Utils/TextInput";

import Layout from "@/Components/Utils/Layout";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Récupération des paramètres depuis l'URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [data, setData] = useState({
    token: token || "",
    email: email || "",
    password: "",
    password_confirmation: "",
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Reset Password - Intranet";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Réinitialiser le formulaire et rediriger vers la page de connexion
        setData({
          token: token || "",
          email: email || "",
          password: "",
          password_confirmation: "",
        });
        navigate("/login", {
          state: {
            message:
              "Password reset successfully! Please login with your new password.",
          },
        });
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: ["Password reset failed"] });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrors({ general: ["An error occurred. Please try again."] });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="hero min-h-screen">
        <div className="hero-content w-full max-w-md">
          <div className="card bg-base-100/10 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body space-y-6">
              <div className="mb-4">
                <h2 className="card-title text-xl">Reset Password</h2>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <div className="form-control">
                  <InputLabel htmlFor="email" value="Email" />

                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="w-full"
                    autoComplete="username"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />

                  <InputError message={errors.email?.[0]} className="mt-2" />
                </div>

                <div className="form-control">
                  <InputLabel htmlFor="password" value="Password" />

                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="w-full"
                    autoComplete="new-password"
                    isFocused={true}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />

                  <InputError message={errors.password?.[0]} className="mt-2" />
                </div>

                <div className="form-control">
                  <InputLabel
                    htmlFor="password_confirmation"
                    value="Confirm Password"
                  />

                  <TextInput
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="w-full"
                    autoComplete="new-password"
                    onChange={(e) =>
                      setData({
                        ...data,
                        password_confirmation: e.target.value,
                      })
                    }
                  />

                  <InputError
                    message={errors.password_confirmation?.[0]}
                    className="mt-2"
                  />
                </div>

                {errors.general && (
                  <div>
                    <InputError message={errors.general[0]} />
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <PrimaryButton className="ml-4" disabled={processing}>
                    Reset Password
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
