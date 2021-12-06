import React, { useEffect, useRef, useState } from "react";
import { Close } from "@components/Icons";
import { motion, useAnimation, useMotionValue } from "framer-motion";

export interface DrawerProps {
    children: any;
    onClose: any;
}

export default function Drawer({ children, onClose }: DrawerProps) {

    const ref: any = useRef();
    const controls = useAnimation();

    useEffect(() => {
        ref?.current?.scrollIntoView({ behavior: "smooth" });
        controls.start({ x: "0%" });

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    const handleEvent = async (e: any) => {
        if (ref?.current && !ref?.current.contains(e.target)) {
            await controls.start({ x: "100%" });

            onClose();
        }
    }

    return (
        <div
            className={`fixed bg-black bg-opacity-50 left-0 inset-0 right-0 h-screen z-50 backdrop-filter backdrop-blur-sm flex justify-end items-start`}
            onMouseDown={handleEvent}
            onTouchEnd={handleEvent}
        >
            <motion.div className="bg-white dark:bg-gray-900 w-max h-screen p-2" animate={controls} initial={{ x: "100%" }} transition={{
                type: "spring",
                damping: 40,
                stiffness: 500,
            }} ref={ref}>
                {/* <Close className="ml-auto w-6 h-6 transition cursor-pointer hover:text-blue-500 mb-2" onClick={() => onClose()} /> */}
                {children}
            </motion.div>
        </div >
    );
}
