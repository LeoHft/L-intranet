import * as Icons from "lucide-react";

// lucide-react exporte aussi des utilitaires et des alias (HomeIcon, LucideHome...) : on ne garde que les icônes.
export const iconNames = Object.keys(Icons).filter(
  (name) => /^[A-Z]/.test(name) && name !== "Icon" && !name.startsWith("Lucide") && !name.endsWith("Icon")
);

const knownIcons = new Set(iconNames);

export const getIcon = (name) => (knownIcons.has(name) ? Icons[name] : null);
