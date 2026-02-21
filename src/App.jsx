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
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "./utils/useTheme.jsx";
import ToastNotifications from "./components/ToastNotifications";
import { addNotification } from "./features/notifications/notificationsSlice";
import { markToastReminderSent } from "./features/travelPlans/travelPlansSlice";

/**
 * Composant App
 * Composant racine avec routing et navigation
 */
function App() {
  const dispatch = useDispatch();
  const favoritesCount = useSelector((state) => state.favorites.cities.length);
  const travelPlans = useSelector((state) => state.travelPlans.plans);
  const { isDark, toggleTheme } = useTheme();

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
      <nav className="sticky top-6 z-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px]">
            <div className="flex justify-between items-center h-16 px-6">
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
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
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
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 text-lg"
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
