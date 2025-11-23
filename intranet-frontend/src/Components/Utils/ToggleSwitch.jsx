import { useState, useEffect } from "react";
import toast from "react-hot-toast";
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

  const notification = (newValue) => {
    if (newValue === true) {
      toast("Accès depuis le réseau local", {
        icon: "🏠",
      });
    } else if (newValue === false) {
      toast("Accès depuis l'extérieur du réseau", {
        icon: "🌐",
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={enabled}
        onChange={() => {
          const newValue = !enabled;
          setEnabled(newValue);
          notification(newValue);
        }}
      />
      <HouseWifi />
    </div>
  );
}
