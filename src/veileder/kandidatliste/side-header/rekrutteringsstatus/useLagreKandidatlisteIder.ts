import { useEffect, useState } from 'react';

const LOCALSTORAGE_KEY = 'ikkeVisAvsluttOppdragModalForKandidatlisteId';

export type KandidatlisteIder = Set<string>;

const hentKandidatlisteIder = (): KandidatlisteIder => {
    try {
        const localstorageValue = window.localStorage.getItem(LOCALSTORAGE_KEY);
        if (localstorageValue) {
            return JSON.parse(localstorageValue);
        }
    } catch (error) {
        console.error('Kunne ikke hente fra local storage:', error);
    }
    return new Set();
};

const useLagreKandidatlisteIder = (): [KandidatlisteIder, (KandidatlisteIder) => void] => {
    const [lukkedata, setLukkedata] = useState<KandidatlisteIder>(hentKandidatlisteIder);

    useEffect(() => {
        window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(lukkedata));
    }, [lukkedata]);
    return [lukkedata, setLukkedata];
};

export default useLagreKandidatlisteIder;
