/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING';
export const REMOVE_SELECTED_ARBEIDSERFARING = 'REMOVE_SELECTED_ARBEIDSERFARING';

export const CHECK_TOTAL_ERFARING = 'CHECK_TOTAL_ERFARING';
export const UNCHECK_TOTAL_ERFARING = 'UNCHECK_TOTAL_ERFARING';

export const TOGGLE_ARBEIDSERFARING_PANEL_OPEN = 'TOGGLE_ARBEIDSERFARING_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    arbeidserfaringer: [],
    totalErfaring: [],
    arbeidserfaringPanelOpen: false
};

export default function arbeidserfaringReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                arbeidserfaringer: action.query.arbeidserfaringer || [],
                totalErfaring: action.query.totalErfaring || [],
                arbeidserfaringPanelOpen:
                    harEnParameter(action.query.arbeidserfaringer, action.query.totalErfaring) ||
                    state.arbeidserfaringPanelOpen
            };
        case SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.includes(action.value) ?
                    state.arbeidserfaringer :
                    [
                        ...state.arbeidserfaringer,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.filter((y) => y !== action.value)
            };
        case CHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: [...state.totalErfaring, action.value]
            };
        case UNCHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: state.totalErfaring.filter((te) => te !== action.value)
            };
        case TOGGLE_ARBEIDSERFARING_PANEL_OPEN:
            return {
                ...state,
                arbeidserfaringPanelOpen: !state.arbeidserfaringPanelOpen
            };
        default:
            return state;
    }
}
