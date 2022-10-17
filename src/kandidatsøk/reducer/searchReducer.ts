export enum KandidatsøkActionType {
    InvalidResponseStatus = 'INVALID_RESPONSE_STATUS',
    FjernError = 'FJERN_ERROR',
}

export type KandidatsøkAction = {
    type: KandidatsøkActionType.FjernError;
};

export type SearchState = {
    error?: any;
    kandidatlisteId?: string;
};

const defaultState: SearchState = {};

const searchReducer = (state: SearchState = defaultState, action: any): SearchState => {
    switch (action.type) {
        case KandidatsøkActionType.InvalidResponseStatus:
            return {
                ...state,
                error: action.error,
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

export default searchReducer;
