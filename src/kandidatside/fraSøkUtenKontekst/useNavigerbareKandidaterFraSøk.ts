import { lenkeTilKandidatside } from '../../app/paths';
import { NyttKandidatsøkØkt } from '../søkekontekst';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';

export type Kandidatnavigering = {
    neste?: string;
    forrige?: string;
    index: number;
    antall: number;
};

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    økt: NyttKandidatsøkØkt
): Kandidatnavigering | null => {
    const fane = useAktivKandidatsidefane();
    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = 0;

    if (økt?.kandidater === undefined) {
        return null;
    }

    antall = økt.kandidater.length;
    index = økt.kandidater.findIndex((kandidat) => kandidat === kandidatnr);

    const forrigeKandidatnr = økt.kandidater[index - 1];
    const nesteKandidatnr = økt.kandidater[index + 1];

    if (forrigeKandidatnr) {
        forrige = lenkeTilKandidatside(forrigeKandidatnr, fane, undefined, false, false, true);
    }

    if (nesteKandidatnr) {
        neste = lenkeTilKandidatside(nesteKandidatnr, fane, undefined, false, false, true);
    }

    return {
        index,
        forrige,
        neste,
        antall,
    };
};

export default useNavigerbareKandidaterFraSøk;
