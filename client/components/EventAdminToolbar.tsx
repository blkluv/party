import { Button, Portal, Toast } from "@conorroberts/beluga";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import deleteEvent from "~/utils/deleteEvent";
import { LoadingIcon, PencilIcon, TrashIcon } from "./Icons";

interface Props {
  eventId: number;
}

const EventAdminToolbar: FC<Props> = ({ eventId }) => {
  const [loading, setLoading] = useState({ delete: false });
  const router = useRouter();
  const [showDeleteError, setShowDeleteError] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      await deleteEvent(eventId);

      await router.push("/");
    } catch (error) {
      setShowDeleteError(true);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };
  return (
    <>
      <Portal>
        <Toast variant="error" title="Error" open={showDeleteError} onOpenChange={setShowDeleteError} duration={2000}>
          <p>Error deleting event</p>
        </Toast>
      </Portal>
      <div>
        <p className="text-gray-400 text-sm text-center">Admin Controls</p>
        <div className="flex gap-4 justify-center border-b border-gray-800 py-2">
          <Button onClick={handleDelete} variant="filled" color="red">
            <p>Delete</p>
            <TrashIcon />
            {loading.delete && <LoadingIcon className="animate-spin" size={20} />}
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
