import { useEffect } from "react";

export default function PopupContainer({ children, setOpen, passRef }) {

  useEffect(() => { passRef?.current?.scrollIntoView({ behavior: "smooth" }) }, []);

  const handleEvent = (e: any) => {
    if (passRef?.current && !passRef?.current.contains(e.target))
      setOpen(false)
  }

  return (
    <div
      className={`fixed bg-gray-900 bg-opacity-60 inset-0 z-50 backdrop-filter backdrop-blur-sm pb-16 pointer-events-auto overflow-y-auto overflow-x-hidden`}
      onMouseDown={handleEvent}
      onTouchEnd={handleEvent}
    >
      {children}
    </div>
  );
}
