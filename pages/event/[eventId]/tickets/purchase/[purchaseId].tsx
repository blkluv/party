import React, { useEffect } from 'react'
import { db } from "@config/firebase";
import { AiFillCheckCircle as CheckIcon } from 'react-icons/ai';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Loading from '@components/Loading';
import createSMSIntent from '@utils/createSMSIntent';

export default function PurchaseResult({ purchaseId, id }) {
    const [doc, loading, error] = useDocumentData(db.doc(`events/${id}/subscribers/${purchaseId}`), { idField: "id" });
    const [event, eventLoading] = useDocumentDataOnce(db.doc(`events/${id}`));

    useEffect(() => {
        const setSuccessState = async () => {

            if (eventLoading) return;
            // Don't send texts if successful purchase was previously made for phone number
            const matchingSubscribers = await db.collection(`events/${id}/subscribers`).where("phoneNumber", "==", doc.phoneNumber).where("status", "==", "success").get();

            if (matchingSubscribers.docs.length)
                return;

            await db.doc(`events/${id}/subscribers/${purchaseId}`).set({ status: "success" }, { merge: true });

            await createSMSIntent({ recipients: [doc.phoneNumber], message: `Purchase successful!\n\nDetails for ${event?.title} will be sent to you on the day of the event.\n\nIf you have any further questions, feel free to contact us.` }, true);
        }


        if (doc?.status === "pending")
            setSuccessState();
    }, [doc, event]);

    if (loading || eventLoading) return <Loading />

    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="bg-white rounded-xl p-8 max-w-md shadow-md flex items-center flex-col justify-center">
                <CheckIcon className="w-24 h-24 text-green-600 grid-cols-1 mb-6" />
                <p className="text-3xl mb-1 text-center">Payment Successful</p>
                <p className="text-gray-400 mb-4 text-center font-normal text-sm">If you have not already recieved notifications for this event, you should soon be recieving a message at <span className="text-blue-500">{doc?.phoneNumber}</span></p>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const { purchaseId, eventId: id } = context.params;

    return {
        props: {
            purchaseId, id
        }
    }
}
