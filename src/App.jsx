import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CityDetail from './pages/CityDetail';
import NotFound from './pages/NotFound';
import { useSelector } from 'react-redux';

/**
 * Composant App
 * Composant racine avec routing et navigation
 */
function App() {
  const favoritesCount = useSelector((state) => state.favorites.cities.length);

  return (
    <Router>
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-primary transition-colors"
            >
              <span className="text-2xl">🌍</span>
              WeatherTravel
            </NavLink>

            {/* Liens de navigation */}
            <div className="flex gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                <span>🔍</span>
                Recherche
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                <span>📌</span>
                Mes destinations
                {favoritesCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {favoritesCount}
                  </span>
                )}
              </NavLink>
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
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © 2026 WeatherTravel - Projet React avec Redux Toolkit
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
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
