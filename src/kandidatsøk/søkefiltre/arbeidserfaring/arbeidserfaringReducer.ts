import { KandidatsøkActionType } from '../../reducer/searchActions';
import { harEnParameter } from '../../reducer/searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING';
export const REMOVE_SELECTED_ARBEIDSERFARING = 'REMOVE_SELECTED_ARBEIDSERFARING';

export const CHECK_TOTAL_ERFARING = 'CHECK_TOTAL_ERFARING';
export const UNCHECK_TOTAL_ERFARING = 'UNCHECK_TOTAL_ERFARING';

export const TOGGLE_ARBEIDSERFARING_PANEL_OPEN = 'TOGGLE_ARBEIDSERFARING_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export interface ArbeidserfaringState {
    arbeidserfaringPanelOpen: boolean;
    arbeidserfaringer: string[];
    totalErfaring: string[];
    maksAlderArbeidserfaring: number | undefined;
}

interface Typeahead {
    value: string;
    suggestions: string[];
}

export interface TypeaheadState {
    kompetanse: Typeahead;
    stilling: Typeahead;
    arbeidserfaring: Typeahead;
    utdanning: Typeahead;
    geografi: Typeahead;
    geografiKomplett: Typeahead;
    sprak: Typeahead;
    forerkort: Typeahead;
    navkontor: Typeahead;
}

const initialState: ArbeidserfaringState = {
    arbeidserfaringer: [],
    totalErfaring: [],
    arbeidserfaringPanelOpen: false,
    maksAlderArbeidserfaring: undefined,
};

export enum ArbeidserfaringActionType {
    SET_MAKS_ALDER_ARBEIDSERFARING = 'SET_MAKS_ALDER_ARBEIDSERFARING',
}

export default function arbeidserfaringReducer(
    state: ArbeidserfaringState = initialState,
    action: any
): ArbeidserfaringState {
    switch (action.type) {
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                arbeidserfaringer: action.query.arbeidserfaringer || [],
                totalErfaring: action.query.totalErfaring || [],
                arbeidserfaringPanelOpen:
                    harEnParameter(action.query.arbeidserfaringer, action.query.totalErfaring) ||
                    state.arbeidserfaringPanelOpen ||
                    !!action.query.maksAlderArbeidserfaring,
                maksAlderArbeidserfaring: action.query.maksAlderArbeidserfaring,
            };
        case SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.includes(action.value)
                    ? state.arbeidserfaringer
                    : [...state.arbeidserfaringer, action.value],
            };
        case REMOVE_SELECTED_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.filter((y) => y !== action.value),
            };
        case CHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: [...state.totalErfaring, action.value],
            };
        case UNCHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: state.totalErfaring.filter((te) => te !== action.value),
            };
        case TOGGLE_ARBEIDSERFARING_PANEL_OPEN:
            return {
                ...state,
                arbeidserfaringPanelOpen: !state.arbeidserfaringPanelOpen,
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                arbeidserfaringPanelOpen: false,
            };
        case ArbeidserfaringActionType.SET_MAKS_ALDER_ARBEIDSERFARING:
            return {
                ...state,
                maksAlderArbeidserfaring: action.value,
            };
        default:
            return state;
    }
}
