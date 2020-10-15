import { useEffect, useState } from 'react';
const LOCAL_STORAGE_KEY_ANTALL_STILLINGER = 'antallStillingerVedSisteAvsluttOppdragBekreftelse';

type LagretAntallStillinger = Record<string, number | undefined>;

const hentAntallLagredeStillinger = (): LagretAntallStillinger => {
    try {
        const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY_ANTALL_STILLINGER);
        if (localStorageValue) {
            return JSON.parse(localStorageValue);
        }
    } catch (error) {
        console.error('Kunne ikke hente fra local storage:', error);
    }
    return {};
};

const useLagretAntallStillinger = (kandidatlisteId: string) : [LagretAntallStillinger, (lagretAntallStillinger: LagretAntallStillinger) => void] => {
    const [lukkedata, setLukkedata] = useState<LagretAntallStillinger>(
        hentAntallLagredeStillinger()
    );

    useEffect(() => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY_ANTALL_STILLINGER, JSON.stringify(lukkedata));
    }, [lukkedata[kandidatlisteId]]);

    return [lukkedata, setLukkedata];
};

export default useLagretAntallStillinger;
