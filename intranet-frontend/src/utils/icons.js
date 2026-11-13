import { lazy } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

// Chaque icône est un petit fichier chargé à la demande : seules celles affichées sont téléchargées.
// Les raccourcis enregistrent le nom au format "Camera" ; lucide indexe ses fichiers en "camera".
const toPascalCase = (name) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const loaders = new Map(
  Object.entries(dynamicIconImports).map(([name, load]) => [toPascalCase(name), load])
);

// Ordre alphabétique, comme avant : « Camera » est proposé avant « CameraOff ».
export const iconNames = [...loaders.keys()].sort();

// Un composant lazy doit rester le même d'un rendu à l'autre.
const components = new Map();

export const getIcon = (name) => {
  if (!loaders.has(name)) return null;
  if (!components.has(name)) components.set(name, lazy(loaders.get(name)));
  return components.get(name);
};
