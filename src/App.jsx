import React from "react";
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
import { useSelector } from "react-redux";
import { useTheme } from "./utils/useTheme.jsx";

/**
 * Composant App
 * Composant racine avec routing et navigation
 */
function App() {
  const favoritesCount = useSelector((state) => state.favorites.cities.length);
  const { isDark, toggleTheme } = useTheme();

  return (
    <Router>
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
            >
              <span className="text-2xl"></span>
              WeatherTravel
            </NavLink>

            {/* Liens de navigation et bouton thème */}
            <div className="flex gap-6 items-center">
              <div className="flex gap-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400"
                    }`
                  }
                >
                  <span></span>
                  Recherche
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400"
                    }`
                  }
                >
                  <span></span>
                  Mes destinations
                  {favoritesCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                      {favoritesCount}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-xl cursor-pointer"
                aria-label="Toggle theme"
                title={isDark ? "Basculer en mode clair" : "Basculer en mode sombre"}
              >
                {isDark ? '🌙' : '☀️'}
              </button>
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 WeatherTravel - Projet React avec Redux Toolkit
            </div>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary dark:hover:text-blue-400 transition-colors"
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
