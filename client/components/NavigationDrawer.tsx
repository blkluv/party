import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import Image from "next/image";
import Link from "next/link";
import isUserAdmin from "~/utils/isUserAdmin";
import { Drawer } from "./form";
import { OutlinedPlusIcon, SignInIcon, SignOutIcon } from "./Icons";

interface Props {
  setOpen: (value: boolean) => void;
}

const NavigationDrawer = ({ setOpen }: Props) => {
  const { user, signOut } = useAuthenticator();
  const admin = isUserAdmin(user);

  return (
    <Drawer onClose={() => setOpen(false)}>
      <div className="flex flex-col h-full">
        <div className="w-full h-20 relative">
          <Image src="/images/Party_Box.svg" layout="fill" objectFit="cover" alt="Orange text reading Party Box" />
        </div>
        {admin && (
          <Link href="/events/create" passHref>
            <div className="nav-drawer-button">
              <OutlinedPlusIcon size={20} />
              <p>Create Event</p>
            </div>
          </Link>
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
          <div className="nav-drawer-button" onClick={() => signOut()}>
            <SignOutIcon size={20} />
            <p>Sign Out</p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
