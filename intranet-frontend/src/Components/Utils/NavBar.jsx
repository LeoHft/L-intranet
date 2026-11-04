import ToggleSwitch from "@/Components/Utils/ToggleSwitch";
import NavLink from "@/Components/Utils/NavLink";
import ListShortcuts from "@/Components/Utils/ListShortcuts";
import SearchBar from "@/Components/Utils/SearchBar";
import { useAuthAttributes } from "@/context/AuthAttributsContext";
import { logout } from "@/api/modules/users";
import useMediaQuery, { DESKTOP_QUERY } from "@/hooks/useMediaQuery";
import { HouseWifi, LayoutGrid, LogOut, Menu, Settings, Shield, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import notifyErrors from "@/utils/notifyErrors";
import { useEffect, useState } from "react";
import IntranetLoader from "./IntranetLoader";

function MobileNavBar({ user, isLogin, isWelcomePage, pathname, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const linkClass = (to) => `btn btn-ghost w-full justify-start ${pathname === to ? "btn-active" : ""}`;

  return (
    <>
      <nav className="navbar sticky top-0 z-50 justify-between bg-base-200/20 px-4 backdrop-blur-sm">
        <Link to="/" aria-label="Accueil" className="btn btn-ghost btn-square" onClick={close}>
          <HouseWifi className="h-7 w-7" />
        </Link>

        {isLogin ? (
          <button
            type="button"
            className="btn btn-ghost btn-square"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        ) : (
          <Link to="/login" className="btn btn-ghost">
            Connexion
          </Link>
        )}

        {/* Masqué plutôt que démonté : les raccourcis ne sont chargés qu'une fois par page. */}
        {isLogin && (
          <div
            id="mobile-menu"
            hidden={!isOpen}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] space-y-4 overflow-y-auto border-b border-base-300 bg-base-100 p-4 shadow-xl"
          >
            <p className="flex items-center gap-2 font-medium">
              <User className="h-5 w-5" />
              {user?.name}
            </p>

            {!isWelcomePage && <SearchBar />}

            <div className="space-y-1">
              <Link to="/dashboard" className={linkClass("/dashboard")} onClick={close}>
                <LayoutGrid className="h-5 w-5" />
                Menu
              </Link>
              {user?.is_admin && (
                <Link to="/adminDashboard" className={linkClass("/adminDashboard")} onClick={close}>
                  <Shield className="h-5 w-5" />
                  Admin
                </Link>
              )}
              <Link to="/profile/edit" className={linkClass("/profile/edit")} onClick={close}>
                <Settings className="h-5 w-5" />
                Modifier le profil
              </Link>
            </div>

            <div>
              <p className="mb-2 text-sm text-base-content/70">Raccourcis</p>
              <ListShortcuts className="flex-wrap gap-3" />
            </div>

            {user?.is_admin && (
              <div className="flex items-center justify-between">
                <span>Liens du réseau local</span>
                <ToggleSwitch />
              </div>
            )}

            <button type="button" onClick={onLogout} className="btn btn-ghost w-full justify-start text-error">
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        )}
      </nav>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" onClick={close} />}
    </>
  );
}

export default function NavBar() {
  const authContext = useAuthAttributes();
  const user = authContext?.userAttributes;
  const isLogin = user.connected || false;
  const location = useLocation();
  const navigate = useNavigate();
  const isWelcomePage = location.pathname === "/";
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Attendre la mise à jour de la session : /login renvoie vers le tableau de bord un utilisateur encore
  // connecté, et réafficher le menu avant relancerait ses requêtes sans token.
  const leave = () => {
    authContext.FetchUserAttributes().finally(() => {
      setIsLoading(false);
      navigate("/login");
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    notifyErrors(logout(), {
      success: leave,
      error: (error) => {
        leave();
        return error.message;
      },
    });
  };

  if (isLoading) {
    return <IntranetLoader />;
  }

  if (!isDesktop) {
    return (
      <MobileNavBar
        user={user}
        isLogin={isLogin}
        isWelcomePage={isWelcomePage}
        pathname={location.pathname}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <nav className="navbar sticky top-0 bg-base-200/20 backdrop-blur-sm z-50">
      <div className="container mx-auto">
        <div className="navbar-start">
          <div className="flex items-center">
            <ul className="menu menu-horizontal flex items-end">
              <li>
                <Link to="/" className="btn btn-ghost">
                  <HouseWifi className="h-7 w-7 hover:animate-bounce" />
                </Link>
              </li>
              {isLogin && !isWelcomePage ? (
                <>
                  <li>
                    <NavLink
                      to="/dashboard"
                      active={location.pathname === "/dashboard"}
                      className="text-base-content/90 font-medium"
                    >
                      Menu
                    </NavLink>
                  </li>
                  {user?.is_admin ? (
                    <li>
                      <NavLink
                        to="/adminDashboard"
                        active={location.pathname === "/adminDashboard"}
                        className="text-base-content/90 font-medium"
                      >
                        Admin
                      </NavLink>
                    </li>
                  ) : null}
                  <li>
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        className="text-base-content/90 font-medium flex flex-row"
                      >
                        <User className="h-5 w-5 pr-1" />
                        <p>{user?.name}</p>
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg"
                      >
                        <li>
                          <NavLink
                            to="/profile/edit"
                            className="btn btn-ghost w-full justify-start text-left"
                          >
                            Modifier le profil
                          </NavLink>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="btn btn-ghost w-full justify-start text-left text-error"
                          >
                            Déconnexion
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              ) : !isLogin ? (
                <li>
                  <NavLink
                    to="/login"
                    active={location.pathname === "/login"}
                  >
                    Connexion
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="navbar-end">
          <div className="flex gap-3">
            {isLogin ? <ListShortcuts /> : null}
            {user?.is_admin && !isWelcomePage ? <ToggleSwitch /> : null}
            {isLogin && !isWelcomePage ? <SearchBar /> : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
