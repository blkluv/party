import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import ServiceForm from "~/components/ServiceForm";
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
    <div className="mx-auto max-w-3xl w-full pt-5">
      <h1 className="text-xl font-bold text-center">Manage Services</h1>
      <ServiceForm />
    </div>
  );
};

export default Page;
