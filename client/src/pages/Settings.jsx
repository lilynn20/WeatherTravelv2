import React, { useEffect, useState } from "react";

const SETTINGS_KEY = "weathertravel_settings";

const defaultSettings = {
  homeCity: "",
  units: "metric",
  language: "fr",
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-2">
            Parametres
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Personnalisez vos preferences de recherche
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Ville par defaut
              </label>
              <input
                type="text"
                name="homeCity"
                value={settings.homeCity}
                onChange={handleChange}
                placeholder="Ex: Paris"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Unites
              </label>
              <select
                name="units"
                value={settings.units}
                onChange={handleChange}
                className="input-field"
              >
                <option value="metric">Celsius</option>
                <option value="imperial">Fahrenheit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Langue
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="input-field"
              >
                <option value="fr">Francais</option>
                <option value="en">Anglais</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200"
              >
                Enregistrer
              </button>
              {saved && (
                <span className="text-sm text-green-700 dark:text-green-300">
                  Parametres enregistres
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
