import { useState, useEffect } from 'react';
import { erInaktiv, KandidatIKandidatliste } from '../kandidatlistetyper';

const erAlleMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    const aktiveOgSlettaKandidater = kandidater.filter(
        (kandidat) => !erInaktiv(kandidat) || kandidat.arkivert
    );

    if (aktiveOgSlettaKandidater.length === 0) {
        return false;
    }

    return aktiveOgSlettaKandidater.every((kandidat) => kandidat.tilstand.markert);
};

const useErAlleMarkerte = (kandidater: KandidatIKandidatliste[]): boolean => {
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(erAlleMarkerte(kandidater));

    useEffect(() => {
        setAlleErMarkerte(erAlleMarkerte(kandidater));
    }, [kandidater]);

    return alleErMarkerte;
};

export default useErAlleMarkerte;
