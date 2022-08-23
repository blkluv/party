import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import isUserAdmin from "~/utils/isUserAdmin";

const Page = () => {
  const { user, authStatus } = useAuthenticator();
  const admin = isUserAdmin(user);
  const router = useRouter();

  useEffect(() => {
    if (!admin && authStatus === "authenticated") {
      router.push("/");
    }
  }, [authStatus, admin, router]);

  if (!user) return <LoadingScreen />;

  return (
    <div>
      <h1>Manage Services</h1>
    </div>
  );
};

export default Page;
