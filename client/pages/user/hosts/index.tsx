import { useAuthenticator } from "@aws-amplify/ui-react";
import { PartyBoxHost, PartyBoxHostRole } from "@party-box/common";
import axios from "axios";
import { useEffect, useState } from "react";
import getToken from "~/utils/getToken";

type ProfileHostsDisplay = Pick<PartyBoxHost & PartyBoxHostRole, "name" | "description" | "imageUrl" | "id" | "role">;

const Page = () => {
  const { user } = useAuthenticator();

  const [hosts, setHosts] = useState<ProfileHostsDisplay[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;

        const { data } = await axios.get<ProfileHostsDisplay[]>("/api/user/hosts", {
          headers: { Authorization: `Bearer ${getToken(user)}` },
        });

        setHosts(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export default Page;
