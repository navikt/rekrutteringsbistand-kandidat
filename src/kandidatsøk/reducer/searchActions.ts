export enum KandidatsøkActionType {
    SettKandidatnummer = 'SETT_KANDIDATNUMMER',
    LastFlereKandidater = 'LAST_FLERE_KANDIDATER',
    LukkAlleSokepanel = 'LUKK_ALLE_SOKEPANEL',
    Search = 'SEARCH',
    SearchBegin = 'SEARCH_BEGIN',
    SearchSuccess = 'SEARCH_SUCCESS',
    SearchFailure = 'SEARCH_FAILURE',
    SetState = 'SET_STATE',
    SøkMedInfoFraStilling = 'SØK_MED_INFO_FRA_STILLING',
    SøkMedUrlParametere = 'SØK_MED_URL_PARAMETERE',
    FetchFeatureTogglesBegin = 'FETCH_FEATURE_TOGGLES_BEGIN',
    FetchFeatureTogglesSuccess = 'FETCH_FEATURE_TOGGLES_SUCCESS',
    FetchFeatureTogglesFailure = 'FETCH_FEATURE_TOGGLES_FAILURE',
    FetchKompetanseSuggestions = 'FETCH_KOMPETANSE_SUGGESTIONS',
    SetKompetanseSuggestionsBegin = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN',
    SetKompetanseSuggestionsSuccess = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS',
    RemoveKompetanseSuggestions = 'REMOVE_KOMPETANSE_SUGGESTIONS',
    SetAlertTypeFaaKandidater = 'SET_ALERT_TYPE_FAA_KANDIDATER',
    InvalidResponseStatus = 'INVALID_RESPONSE_STATUS',
    OppdaterAntallKandidater = 'OPPDATER_ANTALL_KANDIDATER',
    MarkerKandidater = 'MARKER_KANDIDATER',
    SetScrollPosition = 'SET_SCROLL_POSITION',
    HentFerdigutfylteStillinger = 'HENT_FERDIGUTFYLTE_STILLINGER',
    HentFerdigutfylteStillingerSuccess = 'HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS',
    HentFerdigutfylteStillingerFailure = 'HENT_FERDIGUTFYLTE_STILLINGER_FAILURE',
    ToggleViktigeYrkerApen = 'TOGGLE_VIKTIGE_YRKER_APEN',
    FerdigutfyltestillingerKlikk = 'FERDIGUTFYLTESTILLINGER_KLIKK',
    FjernError = 'FJERN_ERROR',
}

type SetStateAction = {
    type: KandidatsøkActionType.SetState;
    query: any;
};

type LukkAlleSøkepanelAction = {
    type: KandidatsøkActionType.LukkAlleSokepanel;
};

export type SearchAction = {
    type: KandidatsøkActionType.Search;
    alertType: string;
    fraIndex?: number;
    antallResultater?: number;
};

type SettKandidatnummerAction = {
    type: KandidatsøkActionType.SettKandidatnummer;
};

type LastFlereKandidaterAction = {
    type: KandidatsøkActionType.LastFlereKandidater;
};

export type KandidatsøkAction =
    | SettKandidatnummerAction
    | LastFlereKandidaterAction
    | SetStateAction
    | LukkAlleSøkepanelAction
    | SearchAction;
