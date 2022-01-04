import { FoundWordsMap } from "@utils/getAnagramFoundWords";
import { AnagramSkeleton } from "@utils/getAnagramSkeletons";
import axios from "axios";
import { collection, doc, onSnapshot, query, orderBy, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface UseAnagramGameDataDefaults {
    skeletons?: AnagramSkeleton[];
    foundWords?: FoundWordsMap;
    game?: any;
    previousGuesses?: any;
}
export default function useAnagramGameData(gameId: string, defaults?: UseAnagramGameDataDefaults) {

    const [game, setGame] = useState(defaults.game ?? null);
    const [skeletons, setSkeletons] = useState(defaults.skeletons ?? []);
    const [foundWords, setFoundWords] = useState(defaults.foundWords ?? {});
    const [previousGuesses, setPreviousGuesses] = useState(defaults.previousGuesses ?? [])

    useEffect(() => {
        if (!gameId) return;
        const db = getFirestore();
        (async () => {
            const gameRef = doc(db, "games", gameId);
            onSnapshot(gameRef, (game) => {
                setGame(game.data());
            });

            const previousGuessesRef = query(collection(db, "games", gameId, "guesses"), orderBy("timestamp", "desc"));
            onSnapshot(previousGuessesRef, (docs) => {
                const tmp = []
                docs.forEach((doc) => {
                    tmp.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })
                setPreviousGuesses(tmp);
            });

            const skeletons = query(collection(db, "games", gameId, "skeletons"), orderBy("length", "asc"));
            onSnapshot(skeletons, (docs) => {
                const tmp = []
                docs.forEach(e => {
                    tmp.push({
                        ...e.data(),
                        id: e.id
                    })
                });

                setSkeletons(tmp);
            });

        })();
    }, [gameId]);

    useEffect(() => {
        if (!gameId || !skeletons) return;
        (async () => {
            const { data } = await axios.post("/api/anagram/get-found-words", { gameId, skeletons });

            const { foundWords: tmpFoundWords } = data;

            setFoundWords({ ...tmpFoundWords });
        })()
    }, [gameId, skeletons])


    return { game, skeletons, previousGuesses, foundWords };
}