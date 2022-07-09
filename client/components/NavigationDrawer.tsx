import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import Link from "next/link";
import isUserAdmin from "~/utils/isUserAdmin";
import { Drawer } from "./form";
import { SignInIcon, SignOutIcon } from "./Icons";

interface Props {
  setOpen: (value: boolean) => void;
}

const NavigationDrawer = ({ setOpen }: Props) => {
  const { user, signOut } = useAuthenticator();
  const admin = isUserAdmin(user);

  return (
    <Drawer onClose={() => setOpen(false)}>
      <div className="flex flex-col h-full">
        {admin && (
          <Link href="/events/create" passHref>
            <div className="nav-drawer-button">
              <p>Create Event</p>
            </div>
          </Link>
        )}
        {!user && (
          <div
            className="nav-drawer-button mt-auto"
            onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}
          >
            <SignInIcon size={20} />
            <p>Sign In</p>
          </div>
        )}
        {user && (
          <div className="nav-drawer-button mt-auto" onClick={() => signOut()}>
            <SignOutIcon size={20} />
            <p>Sign Out</p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
