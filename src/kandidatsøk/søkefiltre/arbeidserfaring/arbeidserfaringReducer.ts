import { KandidatsøkAction, KandidatsøkActionType } from '../../reducer/searchActions';
import { harEnParameter } from '../../reducer/searchReducer';

export enum ArbeidserfaringActionType {
    SelectTypeAheadValueArbeidserfaring = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING',
    RemoveSelectedArbeidserfaring = 'REMOVE_SELECTED_ARBEIDSERFARING',
    CheckTotalErfaring = 'CHECK_TOTAL_ERFARING',
    UncheckTotalErfaring = 'UNCHECK_TOTAL_ERFARING',
    ToggleArbeidserfaringPanelOpen = 'TOGGLE_ARBEIDSERFARING_PANEL_OPEN',
    SetMaksAlderArbeidserfaring = 'SET_MAKS_ALDER_ARBEIDSERFARING',
}

type SelectTypeAheadValueArbeidserfaringAction = {
    type: ArbeidserfaringActionType.SelectTypeAheadValueArbeidserfaring;
    arbeidserfaring?: string[];
    value: string;
};

type RemoveSelectedArbeidserfaring = {
    type: ArbeidserfaringActionType.RemoveSelectedArbeidserfaring;
    value: string;
};

type CheckTotalErfaring = {
    type: ArbeidserfaringActionType.CheckTotalErfaring;
    value: string;
};

type UncheckTotalErfaring = {
    type: ArbeidserfaringActionType.UncheckTotalErfaring;
    value: string;
};

type ToggleArbeidserfaringPanelOpen = {
    type: ArbeidserfaringActionType.ToggleArbeidserfaringPanelOpen;
};

type SetMaksAlderArbeidserfaring = {
    type: ArbeidserfaringActionType.SetMaksAlderArbeidserfaring;
    value?: number;
};

export type ArbeidserfaringAction =
    | SelectTypeAheadValueArbeidserfaringAction
    | RemoveSelectedArbeidserfaring
    | CheckTotalErfaring
    | UncheckTotalErfaring
    | ToggleArbeidserfaringPanelOpen
    | SetMaksAlderArbeidserfaring;

export type ArbeidserfaringState = {
    arbeidserfaringPanelOpen: boolean;
    arbeidserfaringer: string[];
    totalErfaring: string[];
    maksAlderArbeidserfaring: number | undefined;
};

type Typeahead = {
    value: string;
    suggestions: string[];
};

export type TypeaheadState = {
    kompetanse: Typeahead;
    stilling: Typeahead;
    arbeidserfaring: Typeahead;
    utdanning: Typeahead;
    geografi: Typeahead;
    geografiKomplett: Typeahead;
    sprak: Typeahead;
    forerkort: Typeahead;
    navkontor: Typeahead;
};

const initialState: ArbeidserfaringState = {
    arbeidserfaringer: [],
    totalErfaring: [],
    arbeidserfaringPanelOpen: false,
    maksAlderArbeidserfaring: undefined,
};

export default function arbeidserfaringReducer(
    state: ArbeidserfaringState = initialState,
    action: ArbeidserfaringAction | KandidatsøkAction
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
        case ArbeidserfaringActionType.SelectTypeAheadValueArbeidserfaring:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.includes(action.value)
                    ? state.arbeidserfaringer
                    : [...state.arbeidserfaringer, action.value],
            };
        case ArbeidserfaringActionType.RemoveSelectedArbeidserfaring:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.filter((y) => y !== action.value),
            };
        case ArbeidserfaringActionType.CheckTotalErfaring:
            return {
                ...state,
                totalErfaring: [...state.totalErfaring, action.value],
            };
        case ArbeidserfaringActionType.UncheckTotalErfaring:
            return {
                ...state,
                totalErfaring: state.totalErfaring.filter((te) => te !== action.value),
            };
        case ArbeidserfaringActionType.ToggleArbeidserfaringPanelOpen:
            return {
                ...state,
                arbeidserfaringPanelOpen: !state.arbeidserfaringPanelOpen,
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                arbeidserfaringPanelOpen: false,
            };
        case ArbeidserfaringActionType.SetMaksAlderArbeidserfaring:
            return {
                ...state,
                maksAlderArbeidserfaring: action.value,
            };
        default:
            return state;
    }
}
