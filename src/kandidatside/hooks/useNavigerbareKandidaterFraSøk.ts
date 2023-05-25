import useFaner from './useFaner';
import { lenkeTilKandidatside } from '../../app/paths';
import { KandidatsøkØkt } from '../søkekontekst';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    økt: KandidatsøkØkt,
    kandidatlisteId?: string
): Kandidatnavigering | null => {
    const [fane] = useFaner();

    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = økt?.totaltAntallKandidater ?? 1;

    if (økt?.navigerbareKandidater === undefined) {
        return null;
    }

    index = økt.navigerbareKandidater.findIndex((kandidat) => kandidat === kandidatnr);

    const forrigeKandidatnr = økt.navigerbareKandidater[index - 1];
    const nesteKandidatnr = økt.navigerbareKandidater[index + 1];

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
