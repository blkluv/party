import getLocalStorage from "@utils/getLocalStorage";
import toggleDarkMode from "@utils/toggleDarkMode";
import { createContext, useEffect, useState } from "react";

const Context = createContext({
    darkMode: false,
    toggleDarkMode: () => { },
    currentClickEvent: null
});

export const Provider = ({ children, ...props }: any) => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentClickEvent, setCurrentClickEvent] = useState(false);

    const darkModeHandler = () => {
        toggleDarkMode();
        setDarkMode(!darkMode);
    }

    const handleClickEvent = (e: any) => {
        setCurrentClickEvent(e);
    }

    useEffect(() => {
        try {
            const { value } = getLocalStorage("darkMode");
            toggleDarkMode(value);
            setDarkMode(value);
        } catch (e) {
            return;
        }
    }, [])

    return (
        <Context.Provider value={{
            darkMode,
            toggleDarkMode: darkModeHandler,
            currentClickEvent,
        }}>
            <div onMouseDown={handleClickEvent} onTouchEnd={handleClickEvent}>
                {children}
            </div>
        </Context.Provider >
    )
}

export default Context;
