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
                value="pastel"
                checked={theme === "pastel"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="LightAbyss"
                value="LightAbyss"
                checked={theme === "LightAbyss"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="DarkAbyss"
                value="DarkAbyss"
                checked={theme === "DarkAbyss"}
                onChange={handleThemeChange} />
            </li>
            <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Topaz"
                value="topaz"
                checked={theme === "topaz"}
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
        </ul>
        </div>
    )
}