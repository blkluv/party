import { Close } from "@components/Icons";
import React, { useEffect, useRef } from "react";

export interface ModalProps {
  children: any;
  onClose: any;
}


const Modal = ({ children, onClose }: ModalProps) => {

  const ref: any = useRef();

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'visible';
    }
  }, []);

  const handleEvent = (e: any) => {
    if (ref?.current && !ref?.current.contains(e?.target))
      onClose();

  }

  return (
    <div
      className={`fixed bg-black bg-opacity-40 inset-0 h-screen z-50 flex justify-center items-center overflow-y-auto p-1`}
      onMouseDown={handleEvent}
      onTouchEnd={handleEvent}
    >
      <div className={`bg-white dark:bg-gray-900 w-screen max-w-max rounded-xl p-4 sm:p-6 absolute top-2 mx-auto`} ref={ref}>
        <Close className="ml-auto w-6 h-6 transition cursor-pointer primary-hover mb-2" onClick={() => onClose()} />
        {children}
      </div>
    </div>
  );
};

export default Modal;
