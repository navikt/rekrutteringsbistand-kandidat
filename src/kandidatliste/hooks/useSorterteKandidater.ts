import { useState } from 'react';
import { Kandidatsortering } from '../Kandidatliste';
import { Kandidat } from '../kandidatlistetyper';
import { sorteringsalgoritmer } from '../kandidatsortering';

const useSorterteKandidater = (
    kandidater: Kandidat[]
): {
    sorterteKandidater: Kandidat[];
    setSortering: (sortering: Kandidatsortering) => void;
} => {
    const [sortering, setSortering] = useState<Kandidatsortering>(null);

    const sorterteKandidater =
        sortering === null || sortering.retning === null
            ? kandidater
            : kandidater.sort(sorteringsalgoritmer[sortering.felt][sortering.retning]);

    return {
        sorterteKandidater,
        setSortering,
    };
};

export default useSorterteKandidater;
