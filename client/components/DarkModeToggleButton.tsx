import useDarkMode from "~/hooks/useDarkMode";
import { Moon, Sun } from "./Icons";

const DarkModeToggleButton = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      <p>{`${darkMode ? "Light" : "Dark"} Mode`}</p>
    </div>
  );
};

export default DarkModeToggleButton;
