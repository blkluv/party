import DarkModeToggleButton from "./DarkModeToggleButton";
import { Drawer } from "./form";

interface Props {
  setOpen: (value: boolean) => void;
}

const NavigationDrawer = ({ setOpen }: Props) => {
  return (
    <Drawer onClose={() => setOpen(false)}>
      <div className="flex flex-col h-full">
        <div className="mt-auto">
          <DarkModeToggleButton />
        </div>
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
