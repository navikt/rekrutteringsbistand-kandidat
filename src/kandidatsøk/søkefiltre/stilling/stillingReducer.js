import { KandidatsøkActionType } from '../../reducer/searchActions';
import { harEnParameter } from '../../reducer/searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_STILLING = 'SELECT_TYPE_AHEAD_VALUE_STILLING';
export const REMOVE_SELECTED_STILLING = 'REMOVE_SELECTED_STILLING';

export const TOGGLE_STILLING_PANEL_OPEN = 'TOGGLE_STILLING_PANEL_OPEN';

const initialState = {
    stillinger: [],
    stillingPanelOpen: false,
};

export default function stillingReducer(state = initialState, action) {
    switch (action.type) {
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                stillinger: action.query.stillinger || [],
                stillingPanelOpen:
                    harEnParameter(action.query.stillinger) || state.stillingPanelOpen,
            };
        case SELECT_TYPE_AHEAD_VALUE_STILLING:
            return {
                ...state,
                stillinger: state.stillinger.includes(action.value)
                    ? state.stillinger
                    : [...state.stillinger, action.value],
            };
        case REMOVE_SELECTED_STILLING:
            return {
                ...state,
                stillinger: state.stillinger.filter((y) => y !== action.value),
            };
        case TOGGLE_STILLING_PANEL_OPEN:
            return {
                ...state,
                stillingPanelOpen: !state.stillingPanelOpen,
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                stillingPanelOpen: false,
            };
        default:
            return state;
    }
}
