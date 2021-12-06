import { Button } from '@components/beluga';
import Loading from '@components/Loading';
import router from 'next/router';
import React, { useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { AiFillCheckCircle as CheckIcon } from "react-icons/ai";
import { getFirestore, doc, deleteDoc } from "@firebase/firestore";

export default function Unsubscribe({ id }) {

    const db = getFirestore();

    const [value, loading] = useDocumentDataOnce(doc(db, "mailing_list", id));
    const [finished, setFinished]: any = useState(false);

    if (loading) return <Loading />;

    if (!value && !loading) {
        router.push("/error/403");
        return <Loading />;
    }

    const unsubscribeUser = async () => {
        await deleteDoc(doc(db, "mailing_list_users", id));

        setFinished(true);

        setTimeout(() => {
            router.push("/");
        }, 1000);
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            {!finished && <div className="bg-white w-full max-w-md shadow-md p-3 md:p-6 rounded-xl grid gap-6">
                <p className="font-semibold">Hey <span className="text-blue-500">{value?.name ?? "buddy"}</span>,</p>

                <p className="font-normal">If you want to unsubscribe, just click the button below</p>
                <Button onClick={unsubscribeUser}>
                    Unsubscribe
                </Button>
            </div>}
            {finished && <div className="bg-white w-full max-w-md shadow-md p-3 md:p-6 rounded-xl flex gap-3">
                <CheckIcon className="w-10 h-10 text-green-600 fill-current" />
                <p className="font-thin text-2xl text-center">Successfully unsubscribed</p>
            </div>}
        </div>
    )
}


export async function getServerSideProps(context) {
    return {
        props: {
            id: context?.params?.id
        }
    }
}
