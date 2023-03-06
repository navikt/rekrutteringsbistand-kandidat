import { Kandidatfane, lenkeTilKandidatside } from '../../app/paths';
import {
    FinnKandidaterTilKandidatlisteFraNyttKandidatsøkKontekst,
    FraNyttkandidatsøk,
    Søkekontekst,
} from '../søkekontekst';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';

export type Kandidatnavigering = {
    neste?: string;
    forrige?: string;
    index: number;
    antall: number;
};

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kontekst: Søkekontekst
): Kandidatnavigering | null => {
    const fane = useAktivKandidatsidefane();

    if (kontekst.kontekst === 'fraAutomatiskMatching') {
        return null;
    } else {
        return hentKandidatnavigeringForNyttSøk(kandidatnr, fane, kontekst);
    }
};

const hentKandidatnavigeringForNyttSøk = (
    kandidatnr: string,
    fane: Kandidatfane,
    kontekst: FraNyttkandidatsøk | FinnKandidaterTilKandidatlisteFraNyttKandidatsøkKontekst
): Kandidatnavigering | null => {
    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = 0;

    if (kontekst.økt?.kandidater === undefined) {
        return null;
    }

    antall = kontekst.økt.kandidater.length;
    index = kontekst.økt.kandidater.findIndex((kandidat) => kandidat === kandidatnr);

    const kandidatlisteId =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk'
            ? kontekst.kandidatlisteId
            : undefined;

    const forrigeKandidatnr = kontekst.økt.kandidater[index - 1];
    const nesteKandidatnr = kontekst.økt.kandidater[index + 1];

    if (forrigeKandidatnr) {
        forrige = lenkeTilKandidatside(
            forrigeKandidatnr,
            fane,
            kandidatlisteId,
            undefined,
            false,
            false,
            true
        );
    }

    if (nesteKandidatnr) {
        neste = lenkeTilKandidatside(
            nesteKandidatnr,
            fane,
            kandidatlisteId,
            undefined,
            false,
            false,
            true
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
