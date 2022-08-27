import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import Image from "next/image";
import Link from "next/link";
import isUserAdmin from "~/utils/isUserAdmin";
import { Drawer } from "@conorroberts/beluga";
import { GroupIcon, MessageIcon, OutlinedPlusIcon, PersonIcon, SignInIcon, SignOutIcon } from "./Icons";
import isUserHost from "~/utils/isUserHost";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const NavigationDrawer = ({ setOpen, open }: Props) => {
  const { user, signOut } = useAuthenticator();
  const admin = isUserAdmin(user);
  const host = isUserHost(user);

  const signIn = async () => {
    await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
    await Auth.currentSession();
  };

  return (
    <Drawer onOpenChange={() => setOpen(false)} open={open}>
      <div className="flex flex-col h-full">
        <div className="relative w-[calc(250px/1.5)] h-[calc(75px/1.5)] mx-auto">
          <Image src="/images/text-logo.svg" layout="fill" objectFit="contain" alt="Logo" priority loading="eager" />
        </div>
        {(admin || host) && (
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
        {admin && (
          <>
            <Link href="/admin/services" passHref>
              <div className="nav-drawer-button">
                <GroupIcon size={20} />
                <p>Manage Services</p>
              </div>
            </Link>
          </>
        )}
        <Link href="/hire-us" passHref>
          <div className="nav-drawer-button">
            <MessageIcon size={20} />
            <p>Hire Us</p>
          </div>
        </Link>
        {!user && (
          <div className="nav-drawer-button" onClick={() => signIn()}>
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
