import EventPost from "@components/EventPost";
import Head from "@components/Head";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@config/firebase";

export default function LocationHome({ id }: { id: string }) {

    const [data] = useDocumentData(db.doc(`/locations/${id}`));

    console.log(data);

    return (
        <div className="flex-1 p-2">
            <Head title="Home" />

            <div className="flex justify-center gap-4">
                <div className="max-w-xl w-full flex flex-col gap-2 divide-y divide-gray-200 md:border-l xl:border-r">

                    <div className="grid gap-6 divide-y divide-gray-300 border-t">
                        {[].filter((e: any) => new Date(e.event_date) >= new Date(new Date().toDateString())).map((e: any) =>
                            <EventPost {...e} key={e.id} />
                        )}
                    </div>
                    <div>
                        <h3 className="font-normal text-gray-400 text-base px-2 py-1">Past Events</h3>
                        <div className="grid gap-6 w-full border-b border-gray-200">
                            {[].filter((e: any) => new Date(e.event_date) < new Date(new Date().toDateString())).map((e: any) =>
                                <EventPost {...e} key={e.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;

    return {
        props: {
            id
        }
    }
}
