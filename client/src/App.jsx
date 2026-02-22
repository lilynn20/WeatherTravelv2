import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CityDetail from "./pages/CityDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Analytics from "./pages/Analytics";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "./utils/useTheme.jsx";
import ToastNotifications from "./components/ToastNotifications";
import { addNotification } from "./features/notifications/notificationsSlice";
import { markToastReminderSent } from "./features/travelPlans/travelPlansSlice";
import { logout } from "./features/auth/authSlice";
import { fetchFavorites } from "./features/favorites/favoritesSlice";

/**
 * Composant App
 * Composant racine avec routing et navigation
 */
function App() {
  const dispatch = useDispatch();
  const favoritesCount = useSelector((state) => state.favorites.cities.length);
  const travelPlans = useSelector((state) => state.travelPlans.plans);
  const { isDark, toggleTheme } = useTheme();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  // Check travel reminders
  useEffect(() => {
    const checkTravelReminders = () => {
      const now = new Date();

      travelPlans.forEach((plan) => {
        const toastSent = plan.toastReminderSent === true;
        if (toastSent || !plan.travelDate) return;

        const travelDate = new Date(`${plan.travelDate}T00:00:00`);
        if (Number.isNaN(travelDate.getTime())) return;

        const msUntilTravel = travelDate.getTime() - now.getTime();
        const dayBeforeMs = 24 * 60 * 60 * 1000;

        if (msUntilTravel > 0 && msUntilTravel <= dayBeforeMs) {
          dispatch(
            addNotification({
              message: `Rappel: voyage a ${plan.cityName} demain.`,
              type: 'info',
              duration: 0,
              persist: true,
              position: 'bottom',
              linkTo: `/city/${plan.cityName}`,
            })
          );
          dispatch(markToastReminderSent(plan.id));
        }
      });
    };

    checkTravelReminders();
    const intervalId = setInterval(checkTravelReminders, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, travelPlans]);

  return (
    <Router>
      <ToastNotifications />
      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 md:h-16 md:px-6">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-4 text-slate-900 dark:text-slate-100"
            >
              <span className="inline-flex flex-col gap-1">
                <span className="h-1 w-6 rounded-full bg-amber-300/90"></span>
                <span className="h-1 w-4 rounded-full bg-amber-300/90 ml-2"></span>
              </span>
              <span className="text-3xl brand-script">WeatherTravel</span>
            </NavLink>

            {/* Liens de navigation et bouton thème */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100 border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70"
                        : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                    }`
                  }
                >
                  Recherche
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100 border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70"
                        : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                    }`
                  }
                >
                  Mes destinations
                  {favoritesCount > 0 && (
                    <span className="ml-2 bg-primary/15 text-primary text-xs rounded-full px-2 py-0.5">
                      {favoritesCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100 border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70"
                        : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                    }`
                  }
                >
                   Analytics
                </NavLink>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {user?.name || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold border ${
                          isActive
                            ? "text-slate-900 dark:text-slate-100 border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70"
                            : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                        }`
                      }
                    >
                      Connexion
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold border ${
                          isActive
                            ? "text-slate-900 dark:text-slate-100 border-primary/30 bg-primary/10"
                            : "text-slate-500 dark:text-slate-400 border-primary/50 text-primary hover:text-primary hover:bg-primary/5"
                        }`
                      }
                    >
                      S'inscrire
                    </NavLink>
                  </>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 text-base"
                aria-label="Toggle theme"
                title={isDark ? "Basculer en mode clair" : "Basculer en mode sombre"}
              >
                {isDark ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/city/:name" element={<CityDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      <footer className="mt-16 px-4">
        <div className="max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-700/60 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              © 2026 WeatherTravel - Projet React avec Redux Toolkit
            </div>
            <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-200"
              >
                Propulsé par OpenWeatherMap
              </a>
              <span>|</span>
              <span>Made with ❤️ and React</span>
            </div>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
