import { KandidatsøkActionType } from './searchActions';

export type SearchState = {
    error?: any;
    valgtKandidatNr: string;
    scrolletFraToppen: number;
    stillingsoverskrift?: string;
    arbeidsgiver?: any;
    annonseOpprettetAvNavn?: string;
    annonseOpprettetAvIdent?: string;
    kandidatlisteId?: string;
};

const defaultState: SearchState = {
    valgtKandidatNr: '',
    scrolletFraToppen: 0,
};

const searchReducer = (state: SearchState = defaultState, action: any): SearchState => {
    switch (action.type) {
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
