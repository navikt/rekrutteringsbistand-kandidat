import AppState from '../AppState';

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
