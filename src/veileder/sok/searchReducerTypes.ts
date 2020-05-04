import FEATURE_TOGGLES, { KANDIDATLISTE_INITIAL_CHUNK_SIZE } from '../../felles/konstanter';

interface Søkeresultat {
    resultat: {
        kandidater: any[];
        aggregeringer: any[];
        totaltAntallTreff: number;
    },
    kompetanseSuggestions: any[];
}

interface SearchState {
    searchResultat: Søkeresultat;
    maksAntallTreff: number;
    antallVisteKandidater: number;
    searchQueryHash: string;
    isSearching: boolean;
    isInitialSearch: boolean;
    error: any;
    harHentetFeatureToggles: boolean;
    featureToggles: { [key: string]: boolean; };
    ferdigutfylteStillinger: any;
    isEmptyQuery: boolean;
    visAlertFaKandidater: string; // TODO Dette er av typen ALERTTYPE
    valgtKandidatNr: string;
    scrolletFraToppen: number;
    stillingsId?: string;
    harHentetStilling: boolean;
    stillingsoverskrift?: string;
    arbeidsgiver: any;
    annonseOpprettetAvNavn?: string;
    annonseOpprettetAvIdent?: string;
}

export const initialSearchState: SearchState = {
    searchResultat: {
        resultat: {
            kandidater: [],
            aggregeringer: [],
            totaltAntallTreff: 0,
        },
        kompetanseSuggestions: [],
    },
    maksAntallTreff: 0,
    antallVisteKandidater: KANDIDATLISTE_INITIAL_CHUNK_SIZE,
    searchQueryHash: '',
    isSearching: false,
    isInitialSearch: true,
    error: undefined,
    harHentetFeatureToggles: false,
    featureToggles: FEATURE_TOGGLES.reduce((dict, key) => ({ ...dict, [key]: false }), {}),
    ferdigutfylteStillinger: undefined,
    isEmptyQuery: true,
    visAlertFaKandidater: '',
    valgtKandidatNr: '',
    scrolletFraToppen: 0,
    stillingsId: undefined,
    harHentetStilling: false,
    stillingsoverskrift: undefined,
    arbeidsgiver: undefined,
    annonseOpprettetAvNavn: undefined,
    annonseOpprettetAvIdent: undefined,
};
