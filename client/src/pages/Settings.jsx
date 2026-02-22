import React, { useEffect, useState } from "react";
import i18n from "../i18n";
import { t } from "../utils/i18n";

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
    i18n.changeLanguage(settings.language);
    setSaved(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-2">
            {t('settings_title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {t('settings_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t('settings_home_city')}
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
                {t('settings_units')}
              </label>
              <select
                name="units"
                value={settings.units}
                onChange={handleChange}
                className="input-field"
              >
                <option value="metric">{t('units_celsius')}</option>
                <option value="imperial">{t('units_fahrenheit')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t('settings_language')}
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="input-field"
              >
                <option value="fr">{t('lang_fr')}</option>
                <option value="en">{t('lang_en')}</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200"
              >
                {t('settings_save')}
              </button>
              {saved && (
                <span className="text-sm text-green-700 dark:text-green-300">
                  {t('settings_saved')}
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
