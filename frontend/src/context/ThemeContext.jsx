import { createContext, useContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

// ✅ Hook para que puedas usar: const { theme, setTheme } = useTheme();
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
