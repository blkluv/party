import { MdEvent as CalendarIcon } from "react-icons/md";
import React, { useState } from 'react'
import Link from "next/link";
import { Drawer } from "@components/beluga"
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from '@firebase/auth';
import { Home, Menu, Login, Logout, Sun, Moon, Calendar } from "@components/Icons";
import Context from "@context/Context";

export default function Navigation() {

    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Context.Consumer>
            {({ darkMode, toggleDarkMode }) => (
                <div>
                    {menuOpen && <Drawer onClose={() => setMenuOpen(false)}>
                        <div>
                            {user && <Link href="/auth/logout">
                                <div className="nav-drawer-button">
                                    <Logout className="w-6 h-6" />
                                    <p>Logout</p>
                                </div>
                            </Link>}
                            {darkMode ?
                                <div className="nav-drawer-button" onClick={() => toggleDarkMode()}>
                                    <Sun className="w-6 h-6" />
                                    <p>Light Mode</p>
                                </div>
                                : <div className="nav-drawer-button" onClick={() => toggleDarkMode()}>
                                    <Moon className="w-6 h-6" />
                                    <p>Dark Mode</p>
                                </div>
                            }
                        </div>
                    </Drawer>}
                    <div className="md:hidden">
                        <div className="fixed bottom-0 left-0 right-0 shadow-center-lg dark:border-t dark:border-gray-600 flex justify-evenly items-center dark:bg-black bg-white z-30">
                            <Link href="/">
                                <div className="small-screen-nav-button">
                                    <Home className="small-screen-nav-button-icon" />
                                </div>
                            </Link>
                            {!user && <Link href="/auth/login">
                                <div className="small-screen-nav-button">
                                    <Login className="small-screen-nav-button-icon" />
                                </div>
                            </Link>}
                            {user && <Link href="/profile/events">
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
                        <Link href="/">
                            <div className="big-screen-nav-button">
                                <p>
                                    Home
                                </p>
                            </div>
                        </Link>
                        {user && <Link href="/profile/events">
                            <div className="w-6 h-6 cursor-pointer primary-hover">
                                <p>
                                    Events
                                </p>
                            </div>
                        </Link>}
                        {!user && <Link href="/auth/login">
                            <div className="big-screen-nav-button">
                                <p>
                                    Login
                                </p>
                            </div>
                        </Link>}
                    </div>
                </div >)}
        </Context.Consumer>
    )
}