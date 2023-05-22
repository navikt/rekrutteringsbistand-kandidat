import useFaner from '../hooks/useFaner';
import { lenkeTilKandidatside } from '../../app/paths';
import { KandidatsøkØkt } from '../søkekontekst';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kandidatlisteId: string,
    økt: KandidatsøkØkt
): Kandidatnavigering | null => {
    const [fane] = useFaner();

    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = økt?.totaltAntallKandidater ?? 1;

    if (økt?.kandidaterPåSiden === undefined) {
        return null;
    }

    index = økt.kandidaterPåSiden.findIndex((kandidat) => kandidat === kandidatnr);

    const forrigeKandidatnr = økt.kandidaterPåSiden[index - 1];
    const nesteKandidatnr = økt.kandidaterPåSiden[index + 1];

    if (forrigeKandidatnr) {
        forrige = lenkeTilKandidatside(forrigeKandidatnr, fane, kandidatlisteId, false, true);
    }

    if (nesteKandidatnr) {
        neste = lenkeTilKandidatside(nesteKandidatnr, fane, kandidatlisteId, false, true);
    }

    return {
        index,
        forrige,
        neste,
        antall,
    };
};

export default useNavigerbareKandidaterFraSøk;
