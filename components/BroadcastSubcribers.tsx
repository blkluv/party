import MailingListSubscriber from '@typedefs/MailingListSubscriber'
import createSMSIntent from '@utils/createSMSIntent';
import React, { useState } from 'react'
import { Button, TextArea } from '@components/beluga';

export interface BroadcastSubscribersProps {
    subscribers: MailingListSubscriber[];
}

export default function BroadcastSubcribers({ subscribers }) {
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (message.length === 0 || loading) return;

        setLoading(true);

        for (const n of subscribers.map(({ phoneNumber }) => phoneNumber)) {
            await createSMSIntent({ recipients: [n], message }, true);
        }

        setLoading(false);
        setMessage("");
        setShowConfirm(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-center font-light mb-2 text-2xl">Broadcast</h2>
            <TextArea onChange={(e) => setMessage(e.target.value)} value={message} />
            {showConfirm ?
                <div className="flex gap-2 justify-center">
                    <Button type="submit" className="bg-green-300 text-white">
                        Confirm
                    </Button>
                    <Button type="button" className="bg-red-300 text-white" onClick={() => setShowConfirm(false)} disabled={loading}>
                        Cancel
                    </Button>
                </div>
                :
                <div className="flex justify-center mt-2">
                    <Button type="button" onClick={() => setTimeout(() => setShowConfirm(true), 500)}>
                        Broadcast
                    </Button>
                </div>
            }
        </form>
    )
}
