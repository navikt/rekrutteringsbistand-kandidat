import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';

const erAlleKandidaterMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.length > 0 && kandidater.filter((k) => !k.markert).length === 0;
};

const useKandidatlistefilter = (filtrerteKandidater: KandidatIKandidatliste[]): boolean => {
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleKandidaterMarkerte(filtrerteKandidater)
    );

    useEffect(() => {
        setAlleErMarkerte(erAlleKandidaterMarkerte(filtrerteKandidater));
    }, [filtrerteKandidater]);

    return alleErMarkerte;
};

export default useKandidatlistefilter;
