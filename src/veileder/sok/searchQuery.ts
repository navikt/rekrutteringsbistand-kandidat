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
    alderFra?: number;
    alderTil?: number;
}

const mapStateToSearchQuery = ({ søk, søkefilter }: AppState): SearchQuery => {
    const urlQuery: SearchQuery = {};
    if (søkefilter.fritekst.fritekst) urlQuery.fritekst = søkefilter.fritekst.fritekst;
    if (søkefilter.stilling.stillinger && søkefilter.stilling.stillinger.length > 0)
        urlQuery.stillinger = søkefilter.stilling.stillinger.join('_');
    if (
        søkefilter.arbeidserfaring.arbeidserfaringer &&
        søkefilter.arbeidserfaring.arbeidserfaringer.length > 0
    )
        urlQuery.arbeidserfaringer = søkefilter.arbeidserfaring.arbeidserfaringer.join('_');

    if (søkefilter.kompetanse.kompetanser && søkefilter.kompetanse.kompetanser.length > 0)
        urlQuery.kompetanser = søkefilter.kompetanse.kompetanser.join('_');
    if (søkefilter.utdanning.utdanninger && søkefilter.utdanning.utdanninger.length > 0)
        urlQuery.utdanninger = søkefilter.utdanning.utdanninger.join('_');
    if (søkefilter.geografi.geografiList && søkefilter.geografi.geografiList.length > 0)
        urlQuery.geografiList = søkefilter.geografi.geografiList.join('_');
    if (
        søkefilter.arbeidserfaring.totalErfaring &&
        søkefilter.arbeidserfaring.totalErfaring.length > 0
    )
        urlQuery.totalErfaring = søkefilter.arbeidserfaring.totalErfaring.join('_');
    if (søkefilter.utdanning.utdanningsniva && søkefilter.utdanning.utdanningsniva.length > 0)
        urlQuery.utdanningsniva = søkefilter.utdanning.utdanningsniva.join('_');
    if (søkefilter.sprakReducer.sprak && søkefilter.sprakReducer.sprak.length > 0)
        urlQuery.sprak = søkefilter.sprakReducer.sprak.join('_');
    if (søkefilter.forerkort.forerkortList && søkefilter.forerkort.forerkortList.length > 0)
        urlQuery.forerkort = søkefilter.forerkort.forerkortList.join('_');
    if (
        søkefilter.innsatsgruppe.kvalifiseringsgruppeKoder &&
        søkefilter.innsatsgruppe.kvalifiseringsgruppeKoder.length > 0
    )
        urlQuery.kvalifiseringsgruppeKoder = søkefilter.innsatsgruppe.kvalifiseringsgruppeKoder.join(
            '_'
        );
    if (søkefilter.geografi.maaBoInnenforGeografi)
        urlQuery.maaBoInnenforGeografi = søkefilter.geografi.maaBoInnenforGeografi;
    if (søk.harHentetStilling) urlQuery.harHentetStilling = søk.harHentetStilling;
    if (søkefilter.navkontorReducer.navkontor && søkefilter.navkontorReducer.navkontor.length > 0)
        urlQuery.navkontor = søkefilter.navkontorReducer.navkontor.join('_');
    if (søkefilter.navkontorReducer.minekandidater)
        urlQuery.minekandidater = søkefilter.navkontorReducer.minekandidater;
    if (søkefilter.hovedmal.totaltHovedmal && søkefilter.hovedmal.totaltHovedmal.length > 0)
        urlQuery.hovedmal = søkefilter.hovedmal.totaltHovedmal.join('_');
    if (søkefilter.tilretteleggingsbehov.harTilretteleggingsbehov)
        urlQuery.tilretteleggingsbehov = søkefilter.tilretteleggingsbehov.harTilretteleggingsbehov;
    if (
        søkefilter.tilretteleggingsbehov.kategorier &&
        søkefilter.tilretteleggingsbehov.kategorier.length > 0
    )
        urlQuery.kategorier = søkefilter.tilretteleggingsbehov.kategorier.join('_');
    if (søkefilter.permittering.permittert !== søkefilter.permittering.ikkePermittert)
        urlQuery.permittert = søkefilter.permittering.permittert;
    if (
        søkefilter.tilgjengelighet &&
        søkefilter.tilgjengelighet.oppstartstidspunkter &&
        søkefilter.tilgjengelighet.oppstartstidspunkter.length > 0
    )
        urlQuery.oppstartstidspunkter = søkefilter.tilgjengelighet.oppstartstidspunkter.join('-');
    if (søkefilter.arbeidserfaring.maksAlderArbeidserfaring !== undefined)
        urlQuery.maksAlderArbeidserfaring = søkefilter.arbeidserfaring.maksAlderArbeidserfaring;

    if (
        søkefilter.tilgjengelighet &&
        søkefilter.tilgjengelighet.midlertidigUtilgjengelig &&
        søkefilter.tilgjengelighet.midlertidigUtilgjengelig.length > 0
    )
        urlQuery.midlertidigUtilgjengelig = søkefilter.tilgjengelighet.midlertidigUtilgjengelig.join(
            '_'
        );
    if (søkefilter.alder.fra) urlQuery.alderFra = søkefilter.alder.fra;
    if (søkefilter.alder.til) urlQuery.alderTil = søkefilter.alder.til;

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
        alderFra?: number;
        alderTil?: number;
    };

export const mapUrlToInitialQuery = (url: string, kandidatlisteId?: string): InitialQuery => {
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
    const alderFra = getUrlParameterByName('alderFra');
    const alderTil = getUrlParameterByName('alderTil');

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
    if (kandidatlisteId) stateFromUrl.kandidatlisteId = kandidatlisteId;
    if (alderFra && !isNaN(parseInt(alderFra))) stateFromUrl.alderFra = parseInt(alderFra);
    if (alderTil && !isNaN(parseInt(alderTil))) stateFromUrl.alderTil = parseInt(alderTil);

    return stateFromUrl;
};

export const harUrlParametere = (url: string): boolean => {
    const query: InitialQuery = mapUrlToInitialQuery(url);
    return Object.keys(query).length > 0;
};

const mapTilTilretteleggingsbehov = (tagsFraStilling: string[]) => {
    const tilretteleggingsmuligheterTilBehov = {
        INKLUDERING__ARBEIDSTID: 'arbeidstid',
        INKLUDERING__FYSISK: 'fysisk',
        INKLUDERING__ARBEIDSMILJØ: 'arbeidshverdagen',
        INKLUDERING__GRUNNLEGGENDE: 'utfordringerMedNorsk',
    };

    return tagsFraStilling
        .filter((t) => Object.keys(tilretteleggingsmuligheterTilBehov).includes(t))
        .map((t) => tilretteleggingsmuligheterTilBehov[t]);
};

export const mapStillingTilInitialQuery = (stilling: any): InitialQuery => {
    const stillingHarTilretteleggingsmuligheter = stilling.tag.includes('INKLUDERING');
    const tilretteleggingsbehov = stillingHarTilretteleggingsmuligheter
        ? mapTilTilretteleggingsbehov(stilling.tag)
        : undefined;

    return {
        stillinger: stilling.stilling,
        geografiList: stilling.kommune,
        harHentetStilling: true,
        tilretteleggingsbehov: stillingHarTilretteleggingsmuligheter,
        kategorier: tilretteleggingsbehov,
    };
};
