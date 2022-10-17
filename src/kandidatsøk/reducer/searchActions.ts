export enum KandidatsøkActionType {
    SetState = 'SET_STATE',
    FetchFeatureTogglesBegin = 'FETCH_FEATURE_TOGGLES_BEGIN',
    FetchFeatureTogglesSuccess = 'FETCH_FEATURE_TOGGLES_SUCCESS',
    FetchFeatureTogglesFailure = 'FETCH_FEATURE_TOGGLES_FAILURE',
    FetchKompetanseSuggestions = 'FETCH_KOMPETANSE_SUGGESTIONS',
    InvalidResponseStatus = 'INVALID_RESPONSE_STATUS',
    SetScrollPosition = 'SET_SCROLL_POSITION',
    FjernError = 'FJERN_ERROR',
}

type SetStateAction = {
    type: KandidatsøkActionType.SetState;
    query: any;
};

type FetchFeatureTogglesBeginAction = {
    type: KandidatsøkActionType.FetchFeatureTogglesBegin;
};

type FjernErrorAction = {
    type: KandidatsøkActionType.FjernError;
};

type SetScrollPositionAction = {
    type: KandidatsøkActionType.SetScrollPosition;
    scrolletFraToppen: number;
};

export type KandidatsøkAction =
    | SetStateAction
    | SetScrollPositionAction
    | FetchFeatureTogglesBeginAction
    | FjernErrorAction;
