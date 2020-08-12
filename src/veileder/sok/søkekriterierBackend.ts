import AppState from '../AppState';
import { getHashFromString } from '../../felles/sok/utils';
import { Tilgjengelighet } from './Søkeresultat';

type SøkekriterierBackend = any & {
    hasValues: boolean;
    fraIndex: number;
    antallResultater: number;
    antallAarFra?: number;
    antallAarTil?: number;
};

export const mapTilSøkekriterierBackend = (
    state: AppState,
    action: any
): [SøkekriterierBackend, string | number] => {
    const søkekriterierFraState = mapTilSøkekriterierBackendFraState(state);
    const fraIndex = action.fraIndex || 0;
    const antallResultater = action.antallResultater
        ? Math.max(action.antallResultater, state.søk.antallVisteKandidater)
        : state.søk.antallVisteKandidater;

    const søkekriterierHash = getHashFromString(JSON.stringify(søkekriterierFraState));

    return [
        {
            ...søkekriterierFraState,
            hasValues: Object.values(søkekriterierFraState).some(
                (v) => Array.isArray(v) && v.length
            ),
            fraIndex,
            antallResultater,
        },
        søkekriterierHash,
    ];
};

export const mapTilSøkekriterierBackendFraState = ({
    søk,
    søkefilter,
}: AppState): SøkekriterierBackend => {
    const forerkortState = søkefilter.forerkort.forerkortList;
    const forerkortListe =
        forerkortState && forerkortState.includes('Førerkort: Kl. M (Moped)')
            ? [...forerkortState, 'Mopedførerbevis']
            : forerkortState;

    const geografiListKomplett = søkefilter.geografi.geografiListKomplett;
    const lokasjoner = geografiListKomplett
        ? geografiListKomplett.map((sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`)
        : undefined;

    const permittert =
        søkefilter.permittering.permittert !== søkefilter.permittering.ikkePermittert
            ? JSON.stringify(søkefilter.permittering.permittert)
            : undefined;

    return {
        fritekst: søkefilter.fritekst.fritekst,
        stillinger: søkefilter.stilling.stillinger,
        arbeidserfaringer: søkefilter.arbeidserfaring.arbeidserfaringer,
        utdanninger: søkefilter.utdanning.utdanninger,
        kompetanser: søkefilter.kompetanse.kompetanser,
        geografiList: søkefilter.geografi.geografiList,
        geografiListKomplett: geografiListKomplett,
        lokasjoner: lokasjoner,
        totalErfaring: søkefilter.arbeidserfaring.totalErfaring,
        utdanningsniva: søkefilter.utdanning.utdanningsniva,
        sprak: søkefilter.sprakReducer.sprak,
        kvalifiseringsgruppeKoder: søkefilter.innsatsgruppe.kvalifiseringsgruppeKoder,
        maaBoInnenforGeografi: søkefilter.geografi.maaBoInnenforGeografi,
        forerkort: forerkortListe,
        navkontor: søkefilter.navkontor.navkontor,
        minekandidater: søkefilter.navkontor.minekandidater,
        hovedmal: søkefilter.hovedmal.totaltHovedmal,
        tilretteleggingsbehov: søkefilter.tilretteleggingsbehov.harTilretteleggingsbehov,
        kategorier: søkefilter.tilretteleggingsbehov.kategorier,
        oppstartKoder: søkefilter.tilgjengelighet.oppstartstidspunkter,
        maksAlderYrkeserfaring: søkefilter.arbeidserfaring.maksAlderArbeidserfaring,
        midlertidigUtilgjengelig: inverterMidlertidigUtilgjengeligFordiFilteretErInvertert(
            søkefilter.tilgjengelighet.midlertidigUtilgjengelig
        ),
        permittert: permittert,
        listeId: søk.kandidatlisteId,
        antallAarFra: søkefilter.alder.fra,
        antallAarTil: søkefilter.alder.til,
    };
};

const inverterMidlertidigUtilgjengeligFordiFilteretErInvertert = (
    tilgjengelighetSomSkalFiltreresBort: Tilgjengelighet[]
): Tilgjengelighet[] => {
    if (!tilgjengelighetSomSkalFiltreresBort || tilgjengelighetSomSkalFiltreresBort.length === 0) {
        return [];
    }
    return (Object.values(Tilgjengelighet) as Tilgjengelighet[]).filter(
        (tilgjengelighet) => !tilgjengelighetSomSkalFiltreresBort.includes(tilgjengelighet)
    );
};
