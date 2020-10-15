import { useEffect, useState } from 'react';
const LOCAL_STORAGE_KEY_ANTALL_STILLINGER = 'ikkeVisAvsluttOppdragModalForKandidatlisteId';

type KandidatlisteIder = Set<string>;

const hentKandidatlisteIder = (): KandidatlisteIder => {
    try {
        const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY_ANTALL_STILLINGER);
        if (localStorageValue) {
            return JSON.parse(localStorageValue);
        }
    } catch (error) {
        console.error('Kunne ikke hente fra local storage:', error);
    }
    return new Set();
};

const useLagreKandidatlisteIder = (kandidatlisteId: string) : [KandidatlisteIder, (lagretAntallStillinger: KandidatlisteIder) => void] => {
    const [lukkedata, setLukkedata] = useState<KandidatlisteIder>(
        hentKandidatlisteIder
    );
    
    useEffect(() => {
        
        window.localStorage.setItem(LOCAL_STORAGE_KEY_ANTALL_STILLINGER, JSON.stringify(lukkedata));
    }, [JSON.stringify(lukkedata)]);

    return [lukkedata, setLukkedata];
};

export default useLagreKandidatlisteIder;
