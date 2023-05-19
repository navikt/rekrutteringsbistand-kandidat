import { lenkeTilKandidatside } from '../../app/paths';
import { KandidatsøkØkt } from '../søkekontekst';
import useFaner from '../hooks/useFaner';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    økt: KandidatsøkØkt
): Kandidatnavigering | null => {
    const [fane] = useFaner();

    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = 0;

    if (økt?.kandidaterPåSiden === undefined) {
        return null;
    }

    antall = økt.kandidaterPåSiden.length;
    index = økt.kandidaterPåSiden.findIndex((kandidat) => kandidat === kandidatnr);

    const forrigeKandidatnr = økt.kandidaterPåSiden[index - 1];
    const nesteKandidatnr = økt.kandidaterPåSiden[index + 1];

    if (forrigeKandidatnr) {
        forrige = lenkeTilKandidatside(forrigeKandidatnr, fane, undefined, false, true);
    }

    if (nesteKandidatnr) {
        neste = lenkeTilKandidatside(nesteKandidatnr, fane, undefined, false, true);
    }

    return {
        index,
        forrige,
        neste,
        antall,
    };
};

export default useNavigerbareKandidaterFraSøk;
