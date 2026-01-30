import AppRouter from "./router/AppRouter";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";
import CalculatorModal from "./components/calculator/CalculatorModal";

const App = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <CalculatorModal />
      <AppRouter />
    </>
  );
};

export default App;
