import { createSlice } from '@reduxjs/toolkit'
import updateLocalStorage from '@utils/updateLocalStorage';

export interface SettingsState {
    darkMode: boolean;
}

const initialState: SettingsState = {
    darkMode: false,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleDarkMode: (state: SettingsState, { payload }: { payload: boolean }) => {

            const body = document.querySelector("body").classList;

            if (payload === false) {
                body.remove("dark");
            } else if (payload === true) {
                body.add("dark");
            } else {
                body.toggle("dark");
            }

            const newValue = body.contains("dark");
            state.darkMode = newValue;

            updateLocalStorage("darkMode", { value: newValue });
        }
    },
})

export const { toggleDarkMode } = settingsSlice.actions

export default settingsSlice.reducer