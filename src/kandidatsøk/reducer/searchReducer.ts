import FEATURE_TOGGLES, { KANDIDATLISTE_INITIAL_CHUNK_SIZE } from '../../common/konstanter';
import { MarkerbartSøkeresultat } from '../kandidater-og-modal/KandidaterOgModal';
import { KandidatsøkActionType } from './searchActions';

export type SearchState = {
    searchResultat: Søkeresultat;
    maksAntallTreff: number;
    antallVisteKandidater: number;
    searchQueryHash: string;
    isSearching: boolean;
    isInitialSearch: boolean;
    error?: any;
    harHentetFeatureToggles: boolean;
    featureToggles: { [key: string]: boolean };
    ferdigutfylteStillinger?: any;
    isEmptyQuery: boolean;
    visAlertFaKandidater: KandidatsøkAlert | '';
    valgtKandidatNr: string;
    scrolletFraToppen: number;
    stillingsoverskrift?: string;
    arbeidsgiver?: any;
    annonseOpprettetAvNavn?: string;
    annonseOpprettetAvIdent?: string;
    viktigeYrkerApen?: boolean;
    kandidatlisteId?: string;
};

type Søkeresultat = {
    resultat: {
        kandidater: MarkerbartSøkeresultat[];
        aggregeringer: any[];
        totaltAntallTreff: number;
    };
    kompetanseSuggestions: any[];
};

export enum KandidatsøkAlert {
    Stilling = 'stilling',
    Utdanning = 'utdanning',
    Arbeidserfaring = 'arbeidserfaring',
    Språk = 'sprak',
    Kompetanse = 'kompetanse',
    Geografi = 'geografi',
    Førerkort = 'forerkort',
    Innsatsgruppe = 'innsatsgruppe',
    Sertifikat = 'sertifikat',
    Navkontor = 'navkontor',
    Hovedmål = 'hovedmal',
}

const featureTogglesDefaultFalse = FEATURE_TOGGLES.reduce(
    (dict, key) => ({ ...dict, [key]: false }),
    {}
);

const defaultState: SearchState = {
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
    harHentetFeatureToggles: false,
    featureToggles: featureTogglesDefaultFalse,
    isEmptyQuery: true,
    visAlertFaKandidater: '',
    valgtKandidatNr: '',
    scrolletFraToppen: 0,
};

const searchReducer = (state: SearchState = defaultState, action: any): SearchState => {
    switch (action.type) {
        case KandidatsøkActionType.SøkMedInfoFraStilling:
            return {
                ...state,
                maksAntallTreff: 0,
            };
        case KandidatsøkActionType.SearchBegin:
            return {
                ...state,
                isSearching: true,
            };
        case KandidatsøkActionType.SearchSuccess: {
            const { isPaginatedSok } = action;
            return {
                ...state,
                isSearching: false,
                searchQueryHash: action.searchQueryHash,
                isInitialSearch: false,
                error: undefined,
                isEmptyQuery: action.isEmptyQuery,
                searchResultat: {
                    ...state.searchResultat,
                    resultat: !isPaginatedSok
                        ? action.response
                        : {
                              ...state.searchResultat.resultat,
                              kandidater: [
                                  ...state.searchResultat.resultat.kandidater,
                                  ...action.response.kandidater,
                              ],
                          },
                },
                maksAntallTreff: Math.max(state.maksAntallTreff, action.response.totaltAntallTreff),
            };
        }
        case KandidatsøkActionType.SearchFailure:
            return {
                ...state,
                isSearching: false,
                error: action.error,
            };
        case KandidatsøkActionType.MarkerKandidater:
            return {
                ...state,
                searchResultat: {
                    ...state.searchResultat,
                    resultat: {
                        ...state.searchResultat.resultat,
                        kandidater: action.kandidater,
                    },
                },
            };
        case KandidatsøkActionType.OppdaterAntallKandidater:
            return {
                ...state,
                antallVisteKandidater: action.antall,
            };
        case KandidatsøkActionType.SettKandidatnummer:
            return {
                ...state,
                valgtKandidatNr: action.kandidatnr,
            };
        case KandidatsøkActionType.SetKompetanseSuggestionsBegin:
            return {
                ...state,
            };
        case KandidatsøkActionType.SetKompetanseSuggestionsSuccess:
            return {
                ...state,
                isSearching: false,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: action.response },
            };
        case KandidatsøkActionType.RemoveKompetanseSuggestions:
            return {
                ...state,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: [] },
            };
        case KandidatsøkActionType.FetchFeatureTogglesSuccess:
            return {
                ...state,
                harHentetFeatureToggles: true,
                featureToggles: FEATURE_TOGGLES.reduce(
                    (dict, key) => ({
                        ...dict,
                        [key]: Object.keys(action.data).includes(key) && action.data[key],
                    }),
                    {}
                ),
            };
        case KandidatsøkActionType.FetchFeatureTogglesFailure:
            return {
                ...state,
                harHentetFeatureToggles: true,
                featureToggles: FEATURE_TOGGLES.reduce(
                    (dict, key) => ({ ...dict, [key]: false }),
                    {}
                ),
                error: action.error,
            };
        case KandidatsøkActionType.SetAlertTypeFaaKandidater:
            return {
                ...state,
                visAlertFaKandidater: action.value,
            };
        case KandidatsøkActionType.InvalidResponseStatus:
            return {
                ...state,
                error: action.error,
            };
        case KandidatsøkActionType.SetScrollPosition:
            return {
                ...state,
                scrolletFraToppen: action.scrolletFraToppen,
            };
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                kandidatlisteId: action.query.kandidatlisteId,
            };
        case KandidatsøkActionType.FjernError:
            return {
                ...state,
                error: undefined,
            };
        case KandidatsøkActionType.HentFerdigutfylteStillingerSuccess:
            return {
                ...state,
                ferdigutfylteStillinger: action.data,
            };
        case KandidatsøkActionType.HentFerdigutfylteStillingerFailure:
            return {
                ...state,
                error: action.error,
            };
        case KandidatsøkActionType.ToggleViktigeYrkerApen:
            return {
                ...state,
                viktigeYrkerApen: !state.viktigeYrkerApen,
            };
        default:
            return state;
    }
};

export const harEnParameter = (...arrays: any[]) =>
    arrays.some((array) => array !== undefined && array.length > 0);

export default searchReducer;
