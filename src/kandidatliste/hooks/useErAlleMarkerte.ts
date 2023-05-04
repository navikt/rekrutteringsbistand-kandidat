import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppState from '../../state/AppState';
import { Kandidattilstander } from '../domene/Kandidatressurser';
import { erInaktiv, Kandidat } from '../domene/Kandidat';

const erAlleMarkerte = (kandidater: Kandidat[], kandidattilstander: Kandidattilstander) => {
    const aktiveOgSlettaKandidater = kandidater.filter(
        (kandidat) => !erInaktiv(kandidat) || kandidat.arkivert
    );

    if (aktiveOgSlettaKandidater.length === 0) {
        return false;
    }

    return aktiveOgSlettaKandidater.every(
        (kandidat) => kandidattilstander[kandidat.kandidatnr]?.markert
    );
};

const useErAlleMarkerte = (kandidater: Kandidat[]): boolean => {
    const { kandidattilstander } = useSelector((state: AppState) => state.kandidatliste);

    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleMarkerte(kandidater, kandidattilstander)
    );

    useEffect(() => {
        setAlleErMarkerte(erAlleMarkerte(kandidater, kandidattilstander));
    }, [kandidater, kandidattilstander]);

    return alleErMarkerte;
};

export default useErAlleMarkerte;
