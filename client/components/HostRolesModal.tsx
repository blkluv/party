import { Button, Modal } from "@conorroberts/beluga";
import { FC, useState } from "react";
import UserHostRole from "~/types/UserHostRole";
import AddHostMemberForm from "./AddHostMemberForm";
import HostRolesTable from "./HostRolesTable";
import { OutlinedPlusIcon } from "./Icons";

interface Props {
  open: boolean;
  setOpen: (_: boolean) => void;
  hostId: number;
  roles: UserHostRole[];
}

const HostRolesModal: FC<Props> = ({ open, setOpen, roles,hostId }) => {
  const [viewMode, setViewMode] = useState<"list" | "add">("list");

  return (
    <Modal open={open} onOpenChange={setOpen} title="Manage Roles" description="Add and remove access to this host.">
      <div className="mb-2 flex justify-end gap-4">
        {viewMode === "list" && (
          <Button variant="filled" color="green" onClick={() => setViewMode("add")}>
            <p className="text-sm">Add Member</p>
            <OutlinedPlusIcon size={15} />
          </Button>
        )}
        {viewMode === "add" && (
          <Button variant="filled" color="gray" onClick={() => setViewMode("list")}>
            <p className="text-sm">View Members</p>
          </Button>
        )}
      </div>
      {viewMode === "list" && <HostRolesTable roles={roles} />}
      {viewMode === "add" && <AddHostMemberForm hostId={hostId}/>}
    </Modal>
  );
};

export default HostRolesModal;
