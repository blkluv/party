import { getAuth } from '@firebase/auth';
import React, { useCallback, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiOutlineLoading as LoadingIcon } from 'react-icons/ai';
import { Modal, Button, Input } from '@components/beluga'
import { getStorage, ref, uploadBytes, listAll } from "@firebase/storage";

export interface UploadEventMediaProps {
    setOpen(state: boolean): void;
    eventId: string;
}

export default function UploadEventMedia({ setOpen, eventId }: UploadEventMediaProps) {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null)
    const [filesLoading, setFilesLoading] = useState(false)
    const auth = getAuth();
    const [_user, userLoading] = useAuthState(auth);
    const storage = getStorage();

    const uploadData = async (e: any) => {
        e.preventDefault();

        if (selectedFile === null || userLoading) return;

        setFilesLoading(true);


        const uploadRef = ref(storage, `/events/${eventId}/${selectedFile.name}`);
        await uploadBytes(uploadRef, selectedFile);

        await getFiles();
        setSelectedFile(null);
    }

    const getFiles = useCallback(async () => {
        setFilesLoading(true);
        const data = await listAll(ref(storage, `/events/${eventId}`));
        setFiles(data.items);
        setFilesLoading(false);
    }, [eventId, storage]);

    useEffect(() => {
        getFiles();
    }, [getFiles]);

    return (
        <Modal onClose={() => setOpen(false)}>
            <form onSubmit={uploadData} className="flex flex-col md:flex-row items-center gap-2">
                <Input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <Button type="submit">
                    Upload
                </Button>
            </form>
            <p className="font-light mt-5">Existing Files</p>
            {filesLoading && <LoadingIcon className="w-10 h-10 animate-spin text-gray-400" />}
            <div className="flex flex-col divide-y divide-gray-50">
                {files.length > 0 ? files.map((e, index) => <div key={`file-${index}`} className="py-1">
                    <p>{e.name}</p>
                </div>) : <p className="text-center">None</p>}
            </div>
        </Modal>
    )
}
