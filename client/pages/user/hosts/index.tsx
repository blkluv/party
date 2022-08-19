import { useAuthenticator } from "@aws-amplify/ui-react";
import { PartyBoxHost, PartyBoxHostRole } from "@party-box/common";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@conorroberts/beluga";
import { LoadingIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";
import CreateHostForm from "~/components/CreateHostForm";
import UserHostsViewCard from "~/components/UserHostsViewCard";

// This is the data we get back from our API.
type ProfileHostsDisplay = Pick<PartyBoxHost & PartyBoxHostRole, "name" | "description" | "imageUrl" | "id" | "role">;

const Page = () => {
  const { user } = useAuthenticator();

  const [hosts, setHosts] = useState<ProfileHostsDisplay[]>([]);
  const [loading, setLoading] = useState({ hosts: false });
  const [viewMode, setViewMode] = useState<"view" | "create">("view");

  const getHosts = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, hosts: true }));

      if (!user) return;

      const { data } = await axios.get<ProfileHostsDisplay[]>("/api/user/hosts", {
        headers: { Authorization: `Bearer ${getToken(user)}` },
      });

      setHosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, hosts: false }));
    }
  }, [user]);

  useEffect(() => {
    getHosts();
  }, [getHosts]);

  return (
    <div className="mx-auto max-w-3xl w-full m-2">
      <MetaData title="My Hosts" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">{viewMode === "view" ? "View Hosts" : "Create Host"}</h1>
        {isUserAdmin(user) && (
          <Button variant="outlined" onClick={() => setViewMode(viewMode === "view" ? "create" : "view")}>
            {viewMode === "view" ? "Create Host" : "View Hosts"}
          </Button>
        )}
      </div>

      {viewMode === "view" && (
        <>
          <div className="divide-y divide-gray-800">
            {hosts.map((host) => (
              <UserHostsViewCard key={`host card ${host.id}`} host={host} onDelete={() => getHosts()} />
            ))}
          </div>
          {loading.hosts && <LoadingIcon className="animate-spin mx-auto my-8" size={30} />}
        </>
      )}

      {viewMode === "create" && isUserAdmin(user) && (
        <CreateHostForm
          onSubmit={() => {
            getHosts();
            setViewMode("view");
          }}
        />
      )}
    </div>
  );
};

export default Page;
