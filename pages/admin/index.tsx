import RequireAuth from '@components/RequireAuth'
import UserDocument from '@typedefs/UserDocument';
import { collection, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [users, setUsers] = useState<UserDocument[]>([]);

    const updateRole = async (uid: string, role: string) => {
        const db = getFirestore();
        await updateDoc(doc(db, 'users', uid), { role });
    }

    useEffect(() => {
        (async () => {
            const db = getFirestore();
            onSnapshot(collection(db, "users"), (snapshot) => {
                const tmpUsers = [];
                snapshot.forEach((doc) => {
                    tmpUsers.push({ ...doc.data() });
                });
                setUsers(tmpUsers);
            })
        })();
    }, []);

    return (
        <RequireAuth allowRoles={["admin"]}>
            <div className='mx-auto max-w-xl flex flex-col gap-2'>
                {users.map(({ uid, displayName, phoneNumber, role }) =>
                    <div key={uid} className='bg-white dark:bg-gray-800 rounded-xl shadow-center-md p-4'>
                        <p>
                            {displayName}
                        </p>
                        <p>
                            {phoneNumber}
                        </p>
                        <div className='flex gap-2'>
                            {["default", "host", "admin"].map((roleName) =>
                                <div
                                    key={`role-button-${roleName}`}
                                    className={`flex items-center justify-center rounded-full px-6 py-2 transition cursor-pointer hover:brightness-95 filter ${roleName === role ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-600"}`}
                                    onClick={() => updateRole(uid, roleName)}
                                >
                                    <p
                                        className="text-center capitalize" onClick={() => updateRole(uid, roleName)}>
                                        {roleName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </RequireAuth>
    )
}
