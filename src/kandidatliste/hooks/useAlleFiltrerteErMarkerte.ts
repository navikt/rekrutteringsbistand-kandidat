import { useState, useEffect } from 'react';
import { erInaktiv, KandidatIKandidatliste } from '../kandidatlistetyper';

const erAlleFiltrerteMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return (
        kandidater.length > 0 &&
        kandidater.some(
            (kandidat) =>
                !kandidat.tilstand.filtrertBort &&
                !kandidat.tilstand.markert &&
                !erInaktiv(kandidat)
        )
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
