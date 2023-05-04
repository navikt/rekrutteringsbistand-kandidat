export enum ErrorActionType {
    VisError = 'INVALID_RESPONSE_STATUS',
    FjernError = 'FJERN_ERROR',
}

export type ErrorAction = {
    type: ErrorActionType.FjernError;
};

export type ErrorState = {
    error?: any;
};

const initialState: ErrorState = {
    error: undefined,
};

const errorReducer = (state: ErrorState = initialState, action: any): ErrorState => {
    switch (action.type) {
        case ErrorActionType.VisError:
            return {
                ...state,
                error: action.error,
            };

        case ErrorActionType.FjernError:
            return {
                ...state,
                error: undefined,
            };

        default:
            return state;
    }
};

export default errorReducer;
