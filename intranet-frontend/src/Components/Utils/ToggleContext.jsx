import { createContext } from 'react';

export const ToggleContext = createContext({
  enabled: true,
  setEnabled: () => {},
});