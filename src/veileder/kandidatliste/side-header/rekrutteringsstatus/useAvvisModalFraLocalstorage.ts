//////////////////// TODO Ares eksperiment  ///////////////

import { useEffect, useState } from 'react';
const LOCALSTORAGE_KEY_AVVIS_MODAL = 'harAvvistModalForAvsluttOppdrag';

const hentAvvisModalFraLocalstorage = () => {
    try {
        const localStorageValue = window.localStorage.getItem(LOCALSTORAGE_KEY_AVVIS_MODAL);
        if (localStorageValue) {
            return new Set<String>(JSON.parse(localStorageValue));
        }
    } catch (error) {
        console.error('Kunne ikke hente fra localstorage:', error);
    }
    return new Set<String>();
};

const useAvvisModalFraLocalStorage = (
    kandidatlisteId: string
): [Set<String>, (harAvvistForKandidatlisteIds: Set<String>) => void] => {
    const [harAvvistForKandlisteIds, setHarAvvistForKandlisteIds] = useState<Set<String>>(
        hentAvvisModalFraLocalstorage()
    );

    useEffect(() => {
        window.localStorage.setItem(
            LOCALSTORAGE_KEY_AVVIS_MODAL,
            JSON.stringify([...harAvvistForKandlisteIds])
        );
    }, kandidatlisteId);

    return [harAvvistForKandlisteIds, setHarAvvistForKandlisteIds];
};

// const useLagretAntallStillinger = (kandidatlisteId: string) : [LagretAntallStillinger, (lagretAntallStillinger: LagretAntallStillinger) => void] => {
//     const [lukkedata, setLukkedata] = useState<LagretAntallStillinger>(
//         hentAntallLagredeStillinger()
//     );
//
//     useEffect(() => {
//         window.localStorage.setItem(LOCAL_STORAGE_KEY_ANTALL_STILLINGER, JSON.stringify(lukkedata));
//     }, [lukkedata[kandidatlisteId]]);
//
//     return [lukkedata, setLukkedata];
// };
export default useLagretAntallStillinger;
