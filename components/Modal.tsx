import React, { useEffect } from "react";
import { IoCloseOutline as CloseIcon } from 'react-icons/io5';


export interface ModalProps {
  children: any;
  setOpen(state: boolean): void;
  size?: string;
}

const Modal = React.forwardRef(({ children, setOpen, size = "3xl" }: ModalProps, ref: any) => {

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

  return (
    <div
      className={`fixed bg-black bg-opacity-50 left-0 inset-0 right-0 h-screen z-50 backdrop-filter backdrop-blur-sm flex justify-center items-start p-1`}
      onMouseDown={handleEvent}
      onTouchEnd={handleEvent}
    >
      <div className={`bg-white w-screen max-w-${size} rounded-xl p-4 sm:p-8`} ref={ref}>
        <CloseIcon className="ml-auto w-6 h-6 transition cursor-pointer hover:text-blue-500 mb-2" onClick={() => setOpen(false)} />
        {children}
      </div>
    </div>
  );
});

export default Modal;
