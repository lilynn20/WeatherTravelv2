export function getWeatherBackground(description) {
  if (!description) return "bg-clear";

  const d = description.toLowerCase();

  if (d.includes("rain")) return "bg-rain";
  if (d.includes("cloud")) return "bg-cloudy";
  if (d.includes("storm")) return "bg-storm";
  if (d.includes("snow")) return "bg-snow";

  return "bg-clear";
}
