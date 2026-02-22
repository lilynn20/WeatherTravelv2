const SETTINGS_KEY = "weathertravel_settings";

export const getStoredSettings = () => {
  if (typeof window === "undefined") {
    return { units: "metric", language: "fr" };
  }

  const stored = window.localStorage.getItem(SETTINGS_KEY);
  if (!stored) {
    return { units: "metric", language: "fr" };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      units: parsed.units || "metric",
      language: parsed.language || "fr",
    };
  } catch {
    return { units: "metric", language: "fr" };
  }
};

export const getTempUnitLabel = (units) => (units === "imperial" ? "F" : "C");
export const getWindUnitLabel = (units) => (units === "imperial" ? "mph" : "m/s");
