"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <button
      aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
      className="icon-button"
      onClick={() => {
        const nextMode = !darkMode;
        document.documentElement.dataset.theme = nextMode ? "dark" : "light";
        setDarkMode(nextMode);
      }}
      title="Alternar tema"
      type="button"
    >
      {darkMode
        ? <Sun aria-hidden="true" className="ui-icon" />
        : <Moon aria-hidden="true" className="ui-icon" />}
    </button>
  );
}
