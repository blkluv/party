import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import Image from "next/image";
import Link from "next/link";
import isUserAdmin from "~/utils/isUserAdmin";
import { Drawer } from "@conorroberts/beluga";
import { OutlinedPlusIcon, PersonIcon, SignInIcon, SignOutIcon } from "./Icons";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const NavigationDrawer = ({ setOpen, open }: Props) => {
  const { user, signOut } = useAuthenticator();
  const admin = isUserAdmin(user);

  return (
    <Drawer onOpenChange={() => setOpen(false)} open={open} >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 justify-center mb-4">
          <Image src="/images/Logo.svg" width={25} height={25} alt="Logo" />
          <h1 className="text-white text-xl font-bold">Party Box</h1>
        </div>
        {admin && (
          <>
            <Link href="/user/hosts" passHref>
              <div className="nav-drawer-button">
                <PersonIcon size={20} />
                <p>My Hosts</p>
              </div>
            </Link>

            <Link href="/events/create" passHref>
              <div className="nav-drawer-button">
                <OutlinedPlusIcon size={20} />
                <p>Create Event</p>
              </div>
            </Link>
          </>
        )}
        {!user && (
          <div
            className="nav-drawer-button"
            onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}
          >
            <SignInIcon size={20} />
            <p>Sign In</p>
          </div>
        )}
        {user && (
          <>
            <div className="nav-drawer-button" onClick={() => signOut()}>
              <SignOutIcon size={20} />
              <p>Sign Out</p>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
