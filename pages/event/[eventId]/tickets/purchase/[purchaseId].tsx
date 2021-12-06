import React, { useEffect, useState } from 'react'
import { AiFillCheckCircle as CheckIcon } from 'react-icons/ai';
import Loading from '@components/Loading';
import createPurchaseReceipt from '@utils/createPurchaseReceipt';
import { getFirestore, doc, collection, query, where, getDocs, setDoc, getDoc } from "@firebase/firestore";

export default function PurchaseResult({ purchaseId, id }) {
    const db = getFirestore();

    const [event, setEvent] = useState(null);
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (event && purchase) return;
        (async () => {
            setLoading(true);

            const eventRef = doc(db, "events", id);
            const eventDoc = await getDoc(eventRef);
            setEvent({ ...eventDoc.data(), id: eventDoc.id });

            const purchaseRef = doc(db, "events", id, "subscribers", purchaseId);
            const purchaseDoc = await getDoc(purchaseRef);
            setPurchase({ ...purchaseDoc.data(), id: purchaseDoc.id });

            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const setSuccessState = async () => {

            if (loading) return;

            // Don't send texts if successful purchase was previously made for phone number
            const subscribersQuery = query(collection(db, "events", id, "subscribers"), where("phoneNumber", "==", purchase.phoneNumber), where("status", "==", "success"));

            const matchingSubscribers = await getDocs(subscribersQuery);

            if (matchingSubscribers.docs.length)
                return;

            await setDoc(doc(db, `events/${id}/subscribers/${purchaseId}`), { status: "success" }, { merge: true })

            await createPurchaseReceipt(purchase.phoneNumber, event.title);
        }

        if (purchase?.status === "pending")
            setSuccessState();
    }, [doc, event]);

    if (loading) return <Loading />

    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md shadow-md flex items-center flex-col justify-center">
                <CheckIcon className="w-24 h-24 text-green-600 grid-cols-1 mb-6" />
                <p className="text-3xl mb-1 text-center">Payment Successful</p>
                <p className="text-gray-400 mb-4 text-center font-normal text-sm">If you have not already recieved notifications for this event, you should soon be recieving a message at <span className="text-blue-500">{purchase?.phoneNumber}</span></p>
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
