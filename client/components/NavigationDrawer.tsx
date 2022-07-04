import Link from "next/link";
import DarkModeToggleButton from "./DarkModeToggleButton";
import { Drawer } from "./form";

interface Props {
  setOpen: (value: boolean) => void;
}

const NavigationDrawer = ({ setOpen }: Props) => {
  return (
    <Drawer onClose={() => setOpen(false)}>
      <div className="flex flex-col h-full">
        <Link href="/events/create" passHref>
          <div className="nav-drawer-button">
            <p>Create Event</p>
          </div>
        </Link>
        {/* <div className="mt-auto">
          <DarkModeToggleButton />
        </div> */}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
