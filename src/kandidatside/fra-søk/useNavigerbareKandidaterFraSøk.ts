import { useSelector } from 'react-redux';
import { Kandidatfane, lenkeTilKandidatside } from '../../app/paths';
import {
    FinnKandidaterTilKandidatlisteFraNyttKandidatsøkKontekst,
    FinnKandidaterTilKandidatlisteMedStilling,
    FinnKandidaterTilKandidatlisteUtenStilling,
    FraKandidatsøk,
    FraNyttkandidatsøk,
    Søkekontekst,
} from '../søkekontekst';
import AppState from '../../AppState';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';
import useLastInnFlereKandidater from './useLastInnFlereKandidater';
import { MarkerbartSøkeresultat } from '../../kandidatsøk/kandidater-og-modal/KandidaterOgModal';

export type Kandidatnavigering = {
    neste?: string;
    forrige?: string;
    index: number;
    antall: number;
    state?: object;
};

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kontekst: Søkekontekst
): Kandidatnavigering | null => {
    const fane = useAktivKandidatsidefane();

    useLastInnFlereKandidater(kontekst, kandidatnr);

    const { kandidater: kandidaterFraState, totaltAntallTreff } = useSelector(
        (state: AppState) => state.søk.searchResultat.resultat
    );

    if (kontekst.kontekst === 'fraAutomatiskMatching') {
        return null;
    } else if (
        kontekst.kontekst === 'fraKandidatsøk' ||
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling' ||
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
    ) {
        return hentKandidatnavigeringForGammeltSøk(
            kandidatnr,
            totaltAntallTreff,
            fane,
            kontekst,
            kandidaterFraState
        );
    } else {
        return hentKandidatnavigeringForNyttSøk(kandidatnr, fane, kontekst);
    }
};

const hentKandidatnavigeringForGammeltSøk = (
    kandidatnr: string,
    totaltAntallTreff: number,
    fane: Kandidatfane,
    kontekst:
        | FraKandidatsøk
        | FinnKandidaterTilKandidatlisteMedStilling
        | FinnKandidaterTilKandidatlisteUtenStilling,
    kandidater: MarkerbartSøkeresultat[]
): Kandidatnavigering => {
    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;

    const aktivKandidat = kandidater.findIndex(
        (kandidat) => kandidat.arenaKandidatnr === kandidatnr
    );

    const kandidatlisteId =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
            ? kontekst.kandidatlisteId
            : undefined;
    const stillingsId =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling'
            ? kontekst.stillingsId
            : undefined;

    const forrigeKandidat = kandidater[aktivKandidat - 1]?.arenaKandidatnr;
    if (forrigeKandidat) {
        forrige = lenkeTilKandidatside(forrigeKandidat, fane, kandidatlisteId, stillingsId);
    }

    const nesteKandidat = kandidater[aktivKandidat + 1]?.arenaKandidatnr;
    if (nesteKandidat) {
        neste = lenkeTilKandidatside(nesteKandidat, fane, kandidatlisteId, stillingsId);
    }

    return {
        index,
        antall: totaltAntallTreff,
        forrige,
        neste,
    };
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
