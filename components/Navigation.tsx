import useAuth from '@utils/useAuth';
import React, { useRef, useState } from 'react'
import { AiOutlineHome as HomeIcon, AiOutlineLogin as LoginIcon, AiOutlineLogout as LogoutIcon } from "react-icons/ai";
import { IoMenu as MenuIcon } from "react-icons/io5";
import { MdEvent as CalendarIcon } from "react-icons/md";
import Link from 'next/link';
import { IconType } from 'react-icons';
import Drawer from './Drawer';
export interface Route {
    name: string;
    Icon: IconType;
    path: string;
}

const defaultRoutes: Route[] = [
    {
        name: "Home",
        path: "/",
        Icon: HomeIcon
    }
];
const loggedInRoutes: Route[] = [
    {
        name: "Events",
        path: "/profile/events",
        Icon: CalendarIcon
    },
];
const loggedInDrawerRoutes: Route[] = [
    {
        name: "Logout",
        path: "/auth/logout",
        Icon: LogoutIcon
    },
];
const loggedOutRoutes: Route[] = [
    {
        name: "Login",
        path: "/auth/login",
        Icon: LoginIcon
    }
];

const adminRoutes = [];

export default function Navigation() {
    return (
        <div>
            <div className="fixed bottom-0 right-0 left-0 z-30 border-t border-gray-300">
                <BottomNavigation />
            </div>
        </div>
    )
}

const BottomNavigation = () => {

    const { user } = useAuth();
    const routes = user ? loggedInRoutes : loggedOutRoutes;
    const drawerRoutes = user ? loggedInDrawerRoutes : [];

    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerRef = useRef();
    return (
        <div className="flex justify-evenly pt-2 pb-8 bg-white">
            {drawerOpen && <Drawer setOpen={setDrawerOpen} ref={drawerRef}>
                <div className="flex flex-col divide-y divide-gray-300">
                    {drawerRoutes.map(({ Icon, path, name }) =>
                        <div key={path} onClick={() => setDrawerOpen(false)}>
                            <Link href={path}>
                                <div className="group cursor-pointer flex gap-2 items-center">
                                    <Icon className="w-10 h-10 cursor-pointer group-hover:text-blue-500 transition p-2" />
                                    <p className="group-hover:text-blue-500 transition text-lg">{name}</p>
                                </div>
                            </Link>
                        </div>)}
                </div>
            </Drawer>}
            {[...defaultRoutes, ...routes].map(({ Icon, path }) =>
                <div key={path} className="cursor-pointer group">
                    <Link href={path}>
                        <div>
                            <Icon className="w-11 h-11 group-hover:text-blue-500 transition p-2" />
                        </div>
                    </Link>
                </div>)}
            <MenuIcon className="w-11 h-11 cursor-pointer hover:text-blue-500 transition p-2" onClick={() => setDrawerOpen(true)} />
        </div>
    )
}
