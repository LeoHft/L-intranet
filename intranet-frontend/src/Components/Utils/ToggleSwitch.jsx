import { useState, useEffect } from "react";
import { HouseWifi } from "lucide-react";

export default function ToggleSwitch() {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem("switch_enabled");
    return stored === "true"; // Convertir la chaîne en booléen
  });

  useEffect(() => {
    localStorage.setItem("switch_enabled", enabled.toString());
    window.dispatchEvent(
      new CustomEvent("switchChanged", { detail: { enabled } })
    );
  }, [enabled]);

  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="toggle toggle-primary"
          aria-label="Utiliser les liens du réseau local"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        <HouseWifi />
      </div>
    </>
  );
}
