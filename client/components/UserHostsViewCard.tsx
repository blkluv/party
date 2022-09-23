import { Button, Modal, Toast, Portal } from "@conorroberts/beluga";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import ProfileHostData from "~/types/ProfileHostData";
import deleteHost from "~/utils/deleteHost";
import { LoadingIcon, TrashIcon } from "./Icons";

interface Props {
  host: ProfileHostData;

  /**
   * Callback to run after a host is deleted
   */
  onDelete: () => void;
}

const UserHostsViewCard: FC<Props> = ({ host: { id, imageUrl, name, description }, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState({ delete: false });
  const [error, setError] = useState({ delete: false });

  const handleDeleteHost = async () => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));

      await deleteHost(id);

      onDelete();
    } catch (error) {
      setError((prev) => ({ ...prev, delete: true }));
    } finally {
      setShowDeleteDialog(false);
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <>
      <Portal>
        <Toast
          open={error.delete}
          onOpenChange={(value) => setError((prev) => ({ ...prev, delete: value }))}
          variant="error"
          title="Delete Error"
          duration={2000}
        >
          <p>Somethign went wrong deleting &quot;{name}&quot;</p>
        </Toast>
      </Portal>

      <Modal
        title="Delete Host"
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="Are you sure you want to delete this host?"
      >
        <div className="flex justify-center gap-4 mt-8">
          <Button color="gray" variant="filled" onClick={() => setShowDeleteDialog(false)}>
            No, cancel
          </Button>
          <Button color="red" variant="filled" onClick={() => handleDeleteHost()}>
            <p>Yes, delete</p>
            {loading.delete && <LoadingIcon size={15} className="animate-spin text-white" />}
          </Button>
        </div>
      </Modal>
      <div className="flex gap-2 py-1">
        <Link passHref href={`/hosts/${id}`}>
          <div className="p-2 flex gap-4 hover:bg-gray-800 rounded-md transition cursor-pointer flex-1">
            <div className="relative rounded-full object-cover overflow-hidden w-16 h-16">
              <Image
                src={imageUrl}
                className="rounded-full object-cover overflow-hidden w-16 h-16"
                objectFit="cover"
                layout="fill"
                alt="Host profile photo"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-lg">{name}</h2>
              <p className="text-gray-200 text-sm">{description}</p>
            </div>
          </div>
        </Link>
        <div className="flex flex-col ml-auto border-l justify-center border-gray-800 p-2">
          <TrashIcon onClick={() => setShowDeleteDialog(true)} size={20} className="primary-hover" />
        </div>
      </div>
    </>
  );
};

export default UserHostsViewCard;
