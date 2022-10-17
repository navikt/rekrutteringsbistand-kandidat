import FEATURE_TOGGLES, { KANDIDATLISTE_INITIAL_CHUNK_SIZE } from '../../common/konstanter';
import { KandidatsøkActionType } from './searchActions';

export type SearchState = {
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

        default:
            return state;
    }
};

export const harEnParameter = (...arrays: any[]) =>
    arrays.some((array) => array !== undefined && array.length > 0);

export default searchReducer;
