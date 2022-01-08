import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { Drawer } from "@components/beluga"
import { Home, Menu, Login, Logout, Sun, Moon, Calendar, Admin } from "@components/Icons";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { SettingsState, toggleDarkMode } from "@redux/settings";

export default function Navigation() {

    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { darkMode } = useSelector<RootState, SettingsState>(state => state.settings);
    const [auth] = useAuth();
    const router = useRouter();

    useEffect(() => {
        setMenuOpen(false);
    }, [router.pathname])

    return (
        <div>
            {menuOpen && <Drawer onClose={() => setMenuOpen(false)}>
                <div>
                    {darkMode ?
                        <div className="nav-drawer-button" onClick={() => dispatch(toggleDarkMode())}>
                            <Sun className="w-6 h-6" />
                            <p>Light Mode</p>
                        </div>
                        : <div className="nav-drawer-button" onClick={() => dispatch(toggleDarkMode())}>
                            <Moon className="w-6 h-6" />
                            <p>Dark Mode</p>
                        </div>
                    }
                    {auth?.role === "admin" && <Link href="/admin" passHref>
                        <div className="nav-drawer-button">
                            <Admin className="w-6 h-6" />
                            <p>Admin</p>
                        </div>
                    </Link>}
                    {auth && <Link href="/auth/logout" passHref>
                        <div className="nav-drawer-button mt-auto">
                            <Logout className="w-6 h-6" />
                            <p>Logout</p>
                        </div>
                    </Link>}
                </div>
            </Drawer>}
            <div className="md:hidden">
                <div className="fixed bottom-0 left-0 right-0 shadow-center-lg dark:border-t dark:border-gray-600 flex justify-evenly items-center dark:bg-black bg-white z-30">
                    <Link href="/" passHref>
                        <div className="small-screen-nav-button">
                            <Home className="small-screen-nav-button-icon" />
                        </div>
                    </Link>
                    {!auth && <Link href="/auth/login" passHref>
                        <div className="small-screen-nav-button">
                            <Login className="small-screen-nav-button-icon" />
                        </div>
                    </Link>}
                    {(auth?.role === "host" || auth?.role === "admin") && <Link href="/profile/events" passHref>
                        <div className="small-screen-nav-button">
                            <Calendar className="small-screen-nav-button-icon" />
                        </div>
                    </Link>}
                    <div className="small-screen-nav-button">
                        <Menu className="small-screen-nav-button-icon" onClick={() => setMenuOpen(true)} />
                    </div>
                </div>
            </div>
            <div className="hidden md:flex relative z-30 justify-start w-full px-6 gap-6 items-center pt-4">
                <Menu className="w-6 h-6 cursor-pointer primary-hover" onClick={() => setMenuOpen(true)} />
                <Link href="/" passHref>
                    <div className="big-screen-nav-button">
                        <p>
                            Home
                        </p>
                    </div>
                </Link>
                {(auth?.role === "host" || auth?.role === "admin") && <Link href="/profile/events" passHref>
                    <div className="big-screen-nav-button">
                        <p>
                            Events
                        </p>
                    </div>
                </Link>}
                {auth?.role === "admin" && <Link href="/admin" passHref>
                    <div className="big-screen-nav-button">
                        <p>
                            Admin
                        </p>
                    </div>
                </Link>}
                {!auth && <Link href="/auth/login" passHref>
                    <div className="big-screen-nav-button">
                        <p>
                            Login
                        </p>
                    </div>
                </Link>}
            </div>
        </div >)
}