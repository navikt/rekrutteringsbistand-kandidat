import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../kandidatlistetyper';

const erAlleFiltrerteMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return (
        kandidater.length > 0 &&
        kandidater.filter(
            (kandidat) => !kandidat.tilstand.filtrertBort && !kandidat.tilstand.markert
        ).length === 0
    );
};

const useAlleFiltrerteErMarkerte = (kandidater: KandidatIKandidatliste[]): boolean => {
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleFiltrerteMarkerte(kandidater)
    );

    useEffect(() => {
        setAlleErMarkerte(erAlleFiltrerteMarkerte(kandidater));
    }, [kandidater]);

    return alleErMarkerte;
};

export default useAlleFiltrerteErMarkerte;
