import { useCallback, useSyncExternalStore } from "react";

// Même seuil que le préfixe `xl:` de Tailwind : en dessous, 10 raccourcis et la recherche ne tiennent pas dans la barre de navigation.
export const DESKTOP_QUERY = "(min-width: 1280px)";
export const TOUCH_QUERY = "(pointer: coarse)";

export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
