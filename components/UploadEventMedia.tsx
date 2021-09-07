import { storage } from '@config/firebase';
import useAuth from '@utils/useAuth';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading as LoadingIcon } from 'react-icons/ai';
import { Button, Input } from './FormComponents';
import Modal from './Modal'

export interface UploadEventMediaProps {
    setOpen(state: boolean): void;
    eventId: string;
}

export default function UploadEventMedia({ setOpen, eventId }: UploadEventMediaProps) {
    const ref: any = useRef();
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null)
    const [filesLoading, setFilesLoading] = useState(false)
    const { loading: userLoading } = useAuth();

    const uploadData = async (e: any) => {
        e.preventDefault();

        if (selectedFile === null || userLoading) return;

        setFilesLoading(true);

        const task = storage.ref(`events/${eventId}/${selectedFile.name}`).put(selectedFile);

        task.on("state_changed", null, null, async () => {
            await getFiles();
            setSelectedFile(null);
        });
    }

    const getFiles = async () => {
        setFilesLoading(true);
        const data = await storage.ref(`events/${eventId}`).listAll();
        setFiles(data.items);
        setFilesLoading(false);
    }

    useEffect(() => {
        getFiles();
    }, []);

    return (
        <Modal setOpen={setOpen} ref={ref}>
            <div ref={ref} className="bg-white p-2 rounded-xl m-1 w-screen max-w-xl">
                <form onSubmit={uploadData}>
                    <Input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <Button type="submit">
                        Upload
                    </Button>
                </form>
                <p>Existing Media</p>
                {filesLoading && <LoadingIcon className="w-10 h-10 animate-spin text-gray-400" />}
                <div className="flex flex-col divide-y divide-gray-50">
                    {files.map((e, index) => <div key={`file-${index}`} className="py-1">
                        <p>{e.name}</p>
                    </div>)}
                </div>
            </div>
        </Modal>
    )
}
