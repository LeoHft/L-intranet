import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeSettings() {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };


    return (
        <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
        </div>
        <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Light"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Cupcake"
                value="cupcake"
                checked={theme === "cupcake"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Synthwave"
                value="synthwave"
                checked={theme === "synthwave"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Retro"
                value="retro"
                checked={theme === "retro"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Halloween"
                value="halloween"
                checked={theme === "halloween"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Abyss"
                value="abyss"
                checked={theme === "abyss"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Coffee"
                value="coffee"
                checked={theme === "coffee"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Green"
                value="greenNoise"
                checked={theme === "greenNoise"}
                onChange={handleThemeChange} />
            </li>
        </ul>
        </div>
    )
}