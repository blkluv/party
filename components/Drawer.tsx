import React, { useEffect } from "react";
import { IoCloseOutline as CloseIcon } from 'react-icons/io5';


export interface DrawerProps {
    children: any;
    setOpen(state: boolean): void;
    size?: string;
}

const Drawer = React.forwardRef(({ children, setOpen, size = "96" }: DrawerProps, ref: any) => {

    useEffect(() => {
        ref?.current?.scrollIntoView({ behavior: "smooth" });
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    const handleEvent = (e: any) => {
        if (ref?.current && !ref?.current.contains(e.target))
            setOpen(false)
    }

    const getSize = () => {
        return `w-${size}`
    }

    return (
        <div
            className={`fixed bg-black bg-opacity-50 left-0 inset-0 right-0 h-screen z-50 backdrop-filter backdrop-blur-sm flex justify-end items-start`}
            onMouseDown={handleEvent}
            onTouchEnd={handleEvent}
        >
            <div className={`bg-white ${getSize()} p-4 h-screen animate-slide-in-left`} ref={ref}>
                <CloseIcon className="ml-auto w-6 h-6 transition cursor-pointer hover:text-blue-500 mb-2" onClick={() => setOpen(false)} />
                {children}
            </div>
        </div>
    );
});

export default Drawer;
