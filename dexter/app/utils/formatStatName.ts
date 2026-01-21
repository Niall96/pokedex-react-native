export default function formatStatName(statName: string) {
  const cleaned = statName.trim().toLowerCase();

  // Small special-cases to match common conventions.
  if (cleaned === "hp") return "HP";

  return cleaned
    .split("-")
    .map((part) => (part.length ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}
