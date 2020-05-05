import AppState from '../AppState';
import { getHashFromString } from '../../felles/sok/utils';
import { matchPath } from 'react-router';

// TODO Skal i teorien matche objektet i endepunktet i backend
type Søkekriterier = any & {
    hasValues: boolean;
    fraIndex: number;
    antallResultater: number;
};

export const mapTilSøkekriterier = (
    state: AppState,
    action: any,
): [Søkekriterier, string | number] => {
    const søkekriterierFraState = mapTilSøkekriterierFraState(state);
    const fraIndex = action.fraIndex || 0;
    const antallResultater = action.antallResultater
        ? Math.max(action.antallResultater, state.search.antallVisteKandidater)
        : state.search.antallVisteKandidater;

    const søkekriterierHash = getHashFromString(JSON.stringify(søkekriterierFraState));

    return [
        {
            ...søkekriterierFraState,
            hasValues: Object.values(søkekriterierFraState).some(
                (v) => Array.isArray(v) && v.length
            ),
            fraIndex,
            antallResultater
        },
        søkekriterierHash,
    ];
};

export const mapTilSøkekriterierFraState = (state: AppState): any => {
    const forerkortState = state.forerkort.forerkortList;
    const forerkortListe =
        forerkortState && forerkortState.includes('Førerkort: Kl. M (Moped)')
            ? [...forerkortState, 'Mopedførerbevis']
            : forerkortState;

    const geografiListKomplett = state.geografi.geografiListKomplett;
    const lokasjoner = geografiListKomplett
        ? geografiListKomplett.map((sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`)
        : undefined;

    const permittert =
        state.permittering.permittert !== state.permittering.ikkePermittert
            ? JSON.stringify(state.permittering.permittert)
            : undefined;

    return {
        fritekst: state.fritekst.fritekst,
        stillinger: state.stilling.stillinger,
        arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
        utdanninger: state.utdanning.utdanninger,
        kompetanser: state.kompetanse.kompetanser,
        geografiList: state.geografi.geografiList,
        geografiListKomplett: geografiListKomplett,
        lokasjoner: lokasjoner,
        totalErfaring: state.arbeidserfaring.totalErfaring,
        utdanningsniva: state.utdanning.utdanningsniva,
        sprak: state.sprakReducer.sprak,
        kvalifiseringsgruppeKoder: state.innsatsgruppe.kvalifiseringsgruppeKoder,
        maaBoInnenforGeografi: state.geografi.maaBoInnenforGeografi,
        forerkort: forerkortListe,
        navkontor: state.navkontorReducer.navkontor,
        minekandidater: state.navkontorReducer.minekandidater,
        hovedmal: state.hovedmal.totaltHovedmal,
        tilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
        kategorier: state.tilretteleggingsbehov.kategorier,
        oppstartKoder: state.tilgjengelighet.oppstartstidspunkter,
        maksAlderYrkeserfaring: state.arbeidserfaring.maksAlderArbeidserfaring,
        midlertidigUtilgjengelig: state.tilgjengelighet.midlertidigUtilgjengelig,
        permittert: permittert,
    };
};
