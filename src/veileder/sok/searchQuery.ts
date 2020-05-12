import { getUrlParameterByName } from '../../felles/sok/utils';
import AppState, {
    FritekstState,
    GeografiState,
    InnsatsgruppeState,
    KompetanseState,
    NavkontorReducerState,
    SprakReducerState,
    StillingState,
} from '../AppState';

interface SearchQuery {
    fritekst?: string;
    stillinger?: string;
    arbeidserfaringer?: string;
    kompetanser?: string;
    utdanninger?: string;
    geografiList?: string;
    totalErfaring?: string;
    utdanningsniva?: string;
    sprak?: string;
    forerkort?: string;
    kvalifiseringsgruppeKoder?: string;
    maaBoInnenforGeografi?: boolean;
    harHentetStilling?: boolean;
    navkontor?: string;
    minekandidater?: boolean;
    hovedmal?: string;
    tilretteleggingsbehov?: boolean;
    kategorier?: string;
    permittert?: boolean;
    oppstartstidspunkter?: string;
    maksAlderArbeidserfaring?: number;
    midlertidigUtilgjengelig?: string;
}

const mapStateToSearchQuery = (state: AppState): SearchQuery => {
    const urlQuery: SearchQuery = {};
    if (state.fritekst.fritekst) urlQuery.fritekst = state.fritekst.fritekst;
    if (state.stilling.stillinger && state.stilling.stillinger.length > 0)
        urlQuery.stillinger = state.stilling.stillinger.join('_');
    if (
        state.arbeidserfaring.arbeidserfaringer &&
        state.arbeidserfaring.arbeidserfaringer.length > 0
    )
        urlQuery.arbeidserfaringer = state.arbeidserfaring.arbeidserfaringer.join('_');

    if (state.kompetanse.kompetanser && state.kompetanse.kompetanser.length > 0)
        urlQuery.kompetanser = state.kompetanse.kompetanser.join('_');
    if (state.utdanning.utdanninger && state.utdanning.utdanninger.length > 0)
        urlQuery.utdanninger = state.utdanning.utdanninger.join('_');
    if (state.geografi.geografiList && state.geografi.geografiList.length > 0)
        urlQuery.geografiList = state.geografi.geografiList.join('_');
    if (state.arbeidserfaring.totalErfaring && state.arbeidserfaring.totalErfaring.length > 0)
        urlQuery.totalErfaring = state.arbeidserfaring.totalErfaring.join('_');
    if (state.utdanning.utdanningsniva && state.utdanning.utdanningsniva.length > 0)
        urlQuery.utdanningsniva = state.utdanning.utdanningsniva.join('_');
    if (state.sprakReducer.sprak && state.sprakReducer.sprak.length > 0)
        urlQuery.sprak = state.sprakReducer.sprak.join('_');
    if (state.forerkort.forerkortList && state.forerkort.forerkortList.length > 0)
        urlQuery.forerkort = state.forerkort.forerkortList.join('_');
    if (
        state.innsatsgruppe.kvalifiseringsgruppeKoder &&
        state.innsatsgruppe.kvalifiseringsgruppeKoder.length > 0
    )
        urlQuery.kvalifiseringsgruppeKoder = state.innsatsgruppe.kvalifiseringsgruppeKoder.join(
            '_'
        );
    if (state.geografi.maaBoInnenforGeografi)
        urlQuery.maaBoInnenforGeografi = state.geografi.maaBoInnenforGeografi;
    if (state.search.harHentetStilling) urlQuery.harHentetStilling = state.search.harHentetStilling;
    if (state.navkontorReducer.navkontor && state.navkontorReducer.navkontor.length > 0)
        urlQuery.navkontor = state.navkontorReducer.navkontor.join('_');
    if (state.navkontorReducer.minekandidater)
        urlQuery.minekandidater = state.navkontorReducer.minekandidater;
    if (state.hovedmal.totaltHovedmal && state.hovedmal.totaltHovedmal.length > 0)
        urlQuery.hovedmal = state.hovedmal.totaltHovedmal.join('_');
    if (state.tilretteleggingsbehov.harTilretteleggingsbehov)
        urlQuery.tilretteleggingsbehov = state.tilretteleggingsbehov.harTilretteleggingsbehov;
    if (state.tilretteleggingsbehov.kategorier && state.tilretteleggingsbehov.kategorier.length > 0)
        urlQuery.kategorier = state.tilretteleggingsbehov.kategorier.join('_');
    if (state.permittering.permittert !== state.permittering.ikkePermittert)
        urlQuery.permittert = state.permittering.permittert;
    if (
        state.tilgjengelighet &&
        state.tilgjengelighet.oppstartstidspunkter &&
        state.tilgjengelighet.oppstartstidspunkter.length > 0
    )
        urlQuery.oppstartstidspunkter = state.tilgjengelighet.oppstartstidspunkter.join('-');
    if (state.arbeidserfaring.maksAlderArbeidserfaring !== undefined)
        urlQuery.maksAlderArbeidserfaring = state.arbeidserfaring.maksAlderArbeidserfaring;

    if (
        state.tilgjengelighet &&
        state.tilgjengelighet.midlertidigUtilgjengelig &&
        state.tilgjengelighet.midlertidigUtilgjengelig.length > 0
    )
        urlQuery.midlertidigUtilgjengelig = state.tilgjengelighet.midlertidigUtilgjengelig.join(
            '_'
        );

    return urlQuery;
};

function toUrlParams(query) {
    return Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+')
        .replace(/%2C/g, ',');
}

export const toUrlQuery = (state: AppState): string => {
    const urlQuery: SearchQuery = mapStateToSearchQuery(state);
    return toUrlParams(urlQuery);
};

export type InitialQuery = FritekstState &
    StillingState &
    KompetanseState &
    SprakReducerState &
    InnsatsgruppeState &
    GeografiState &
    NavkontorReducerState & {
        arbeidserfaringer?: string[];
        utdanninger?: string[];
        utdanningsniva?: string[];
        totalErfaring?: string[];
        forerkort?: string[];
        harHentetStilling?: boolean;
        hovedmal?: string[];
        tilretteleggingsbehov?: boolean;
        kategorier?: string[];
        permittert?: boolean;
        oppstartstidspunkter?: string[];
        midlertidigUtilgjengelig?: string[];
        maksAlderArbeidserfaring?: number;
        kandidatlisteId?: string;
    };

export const mapUrlToInitialQuery = (url: string): InitialQuery => {
    const stateFromUrl: InitialQuery = {};
    const fritekst = getUrlParameterByName('fritekst', url);
    const stillinger = getUrlParameterByName('stillinger', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const totalErfaring = getUrlParameterByName('totalErfaring', url);
    const utdanningsniva = getUrlParameterByName('utdanningsniva', url);
    const sprak = getUrlParameterByName('sprak', url);
    const forerkort = getUrlParameterByName('forerkort', url);
    const kvalifiseringsgruppeKoder = getUrlParameterByName('kvalifiseringsgruppeKoder', url);
    const maaBoInnenforGeografi = getUrlParameterByName('maaBoInnenforGeografi', url);
    const harHentetStilling = getUrlParameterByName('harHentetStilling', url);
    const navkontor = getUrlParameterByName('navkontor', url);
    const minekandidater = getUrlParameterByName('minekandidater', url);
    const hovedmal = getUrlParameterByName('hovedmal', url);
    const tilretteleggingsbehov = getUrlParameterByName('tilretteleggingsbehov', url);
    const kategorier = getUrlParameterByName('kategorier', url);
    const permittert = getUrlParameterByName('permittert');
    const oppstartstidspunkter = getUrlParameterByName('oppstartstidspunkter');
    const maksAlderArbeidserfaring = getUrlParameterByName('maksAlderArbeidserfaring');
    const midlertidigUtilgjengelig = getUrlParameterByName('midlertidigUtilgjengelig');

    if (fritekst) stateFromUrl.fritekst = fritekst;
    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring.split('_');
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    if (sprak) stateFromUrl.sprak = sprak.split('_');
    if (forerkort) stateFromUrl.forerkort = forerkort.split('_');
    if (kvalifiseringsgruppeKoder)
        stateFromUrl.kvalifiseringsgruppeKoder = kvalifiseringsgruppeKoder.split('_');
    if (maaBoInnenforGeografi === 'true') stateFromUrl.maaBoInnenforGeografi = true;
    if (harHentetStilling === 'true') stateFromUrl.harHentetStilling = true;
    if (navkontor) stateFromUrl.navkontor = navkontor.split('_');
    if (minekandidater === 'true') stateFromUrl.minekandidater = true;
    if (hovedmal) stateFromUrl.hovedmal = hovedmal.split('_');
    if (tilretteleggingsbehov === 'true') stateFromUrl.tilretteleggingsbehov = true;
    if (kategorier) stateFromUrl.kategorier = kategorier.split('_');
    if (permittert) stateFromUrl.permittert = permittert === 'true';
    if (oppstartstidspunkter) stateFromUrl.oppstartstidspunkter = oppstartstidspunkter.split('-');
    if (midlertidigUtilgjengelig)
        stateFromUrl.midlertidigUtilgjengelig = midlertidigUtilgjengelig.split('_');
    if (maksAlderArbeidserfaring && !isNaN(parseInt(maksAlderArbeidserfaring)))
        stateFromUrl.maksAlderArbeidserfaring = parseInt(maksAlderArbeidserfaring);

    return stateFromUrl;
};

export const harUrlParametere = (url: string): boolean => {
    const query: InitialQuery = mapUrlToInitialQuery(url);
    return Object.keys(query).length > 0;
};

const mapTilretteleggingsmuligheterTilBehov = (urlQuery, tag) => {
    const nyQuery = { ...urlQuery };

    nyQuery.tilretteleggingsbehov = tag.includes('INKLUDERING');
    if (!nyQuery.tilretteleggingsbehov) {
        return nyQuery;
    }

    nyQuery.kategorier = [];

    const tilretteleggingsmuligheterTilBehov = {
        INKLUDERING__ARBEIDSTID: 'arbeidstid',
        INKLUDERING__FYSISK: 'fysisk',
        INKLUDERING__ARBEIDSMILJØ: 'arbeidshverdagen',
        INKLUDERING__GRUNNLEGGENDE: 'utfordringerMedNorsk',
    };

    nyQuery.kategorier = tag
        .filter((t) => Object.keys(tilretteleggingsmuligheterTilBehov).includes(t))
        .map((t) => tilretteleggingsmuligheterTilBehov[t]);

    return nyQuery;
};

export const mapStillingTilInitialQuery = (stilling: any): InitialQuery => {
    const data: InitialQuery = {};

    data.stillinger = stilling.stilling;
    data.geografiList = stilling.kommune;
    data.harHentetStilling = true;

    if (stilling.tag.length > 0) {
        return mapTilretteleggingsmuligheterTilBehov(data, stilling.tag);
    }
    return data;
};
