import updateLocalStorage from "./updateLocalStorage";

export default function toggleDarkMode(state?: boolean) {

    const body = document.querySelector("body").classList;
    
    if (state === false) {
        body.remove("dark");
    } else if (state === true) {
        body.add("dark");
    } else {
        body.toggle("dark");
    }

    updateLocalStorage("darkMode", { value: body.contains("dark") });
}