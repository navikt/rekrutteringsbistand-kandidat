import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';
import { lenkeTilKandidatside } from '../../app/paths';
import { NyttKandidatsøkØkt } from '../søkekontekst';
import { Kandidatnavigering } from '../fraSøkUtenKontekst/useNavigerbareKandidaterFraSøk';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kandidatlisteId: string,
    økt: NyttKandidatsøkØkt,
    fraAutomatiskMatching: boolean
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
        forrige = lenkeTilKandidatside(
            forrigeKandidatnr,
            fane,
            kandidatlisteId,
            false,
            fraAutomatiskMatching,
            !fraAutomatiskMatching
        );
    }

    if (nesteKandidatnr) {
        neste = lenkeTilKandidatside(
            nesteKandidatnr,
            fane,
            kandidatlisteId,
            false,
            fraAutomatiskMatching,
            !fraAutomatiskMatching
        );
    }

    return {
        index,
        forrige,
        neste,
        antall,
    };
};

export default useNavigerbareKandidaterFraSøk;
