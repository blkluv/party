import firebase, { db } from '@config/firebase';
import UserDocument from '@typedefs/UserDocument';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function useUser(): { user: UserDocument, loading: boolean } {

    const [auth] = useAuthState(firebase.auth());
    const [user, loading] = useDocumentData<UserDocument>(db.collection("users").doc(auth?.uid ?? "none"), { idField: "id" })

    return { user, loading };
}
