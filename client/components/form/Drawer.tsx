import React, { MouseEvent, ReactNode, TouchEvent, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";

export interface DrawerProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
}

interface ResponsiveDrawerProps extends DrawerProps {
  position: "left" | "right";
}

const Drawer = (props: DrawerProps) => {
  return (
    <>
      <ResponsiveDrawer position="right" {...props} />
      <ResponsiveDrawer position="left" {...props} />
    </>
  );
};

const ResponsiveDrawer = ({ children, onClose, position, open }: ResponsiveDrawerProps) => {
  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleEvent = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (ref?.current && !ref?.current?.contains(e.target)) {
      onClose();
    }
  };

  return (
    <Portal>
      {open && (
        <div
          className={`fixed bg-black bg-opacity-50 left-0 inset-0 right-0 h-screen z-50 backdrop-filter backdrop-blur-sm flex justify-end md:justify-start ${
            position === "left" ? "md:block hidden" : "md:hidden"
          }`}
          onMouseDown={handleEvent}
          onTouchEnd={handleEvent}
        >
          <AnimatePresence>
            <motion.div
              className={` bg-white dark:bg-gray-900 w-max h-screen px-2 py-8`}
              initial={{ translateX: position === "left" ? "-100%" : "100%" }}
              animate={{ translateX: position === "left" ? "0%" : "0%" }}
              exit={{ translateX: position === "left" ? "-100%" : "100%" }}
              transition={{
                type: "spring",
                damping: 40,
                stiffness: 500,
              }}
              ref={ref}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Portal>
  );
};

export default Drawer;
