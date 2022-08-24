import { Button, Modal, Portal, Toast } from "@conorroberts/beluga";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useMutation } from "react-query";
import deleteEvent from "~/utils/deleteEvent";
import { LoadingIcon, PencilIcon, TrashIcon } from "./Icons";

interface Props {
  eventId: number;
}

const EventAdminToolbar: FC<Props> = ({ eventId }) => {
  const [loading, setLoading] = useState({ delete: false });
  const router = useRouter();
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: handleDelete, isLoading: deleteLoading } = useMutation(["event", eventId], async () => {
    try {
      await deleteEvent(eventId);

      await router.push("/");
    } catch (error) {
      setShowDeleteError(true);
    }
  });
  return (
    <>
      <Portal>
        <Toast variant="error" title="Error" open={showDeleteError} onOpenChange={setShowDeleteError} duration={2000}>
          <p>Error deleting event</p>
        </Toast>
      </Portal>
      <Modal
        title="Delete event"
        description="Are you sure you want to delete this event?"
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      >
        <div className="flex justify-center gap-4">
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button onClick={() => !deleteLoading && handleDelete()} variant="filled" color="red" disabled={deleteLoading}>
            <p>Delete</p>
            {deleteLoading && <LoadingIcon className="animate-spin" size={20} />}
          </Button>
        </div>
      </Modal>
      <div>
        <p className="text-gray-400 text-sm text-center">Admin Controls</p>
        <div className="flex gap-4 justify-center border-b border-gray-800 py-2">
          <Button onClick={() => setShowDeleteModal(true)} variant="filled" color="red">
            <p>Delete</p>
            <TrashIcon />
          </Button>
          <Button onClick={() => eventId && router.push(`/events/${eventId}/edit`)} variant="filled" color="gray">
            <p>Edit</p>
            <PencilIcon />
          </Button>
        </div>
      </div>
    </>
  );
};

export default EventAdminToolbar;
