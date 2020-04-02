/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter } from '../searchReducer';
import { LUKK_ALLE_SOKEPANEL } from '../konstanter';

export const SELECT_TYPE_AHEAD_VALUE_FORERKORT = 'SELECT_TYPE_AHEAD_VALUE_FORERKORT';
export const REMOVE_SELECTED_FORERKORT = 'REMOVE_SELECTED_FORERKORT';

export const TOGGLE_FORERKORT_PANEL_OPEN = 'TOGGLE_FORERKORT_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    forerkortList: [],
    forerkortPanelOpen: false,
};

export default function forerkortReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                forerkortList: action.query.forerkort || [],
                forerkortPanelOpen:
                    harEnParameter(action.query.forerkort) || state.forerkortPanelOpen,
            };
        case SELECT_TYPE_AHEAD_VALUE_FORERKORT:
            return {
                ...state,
                forerkortList: state.forerkortList.includes(action.value)
                    ? state.forerkortList
                    : [...state.forerkortList, action.value],
            };
        case REMOVE_SELECTED_FORERKORT:
            return {
                ...state,
                forerkortList: state.forerkortList.filter(k => k !== action.value),
            };
        case TOGGLE_FORERKORT_PANEL_OPEN:
            return {
                ...state,
                forerkortPanelOpen: !state.forerkortPanelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                forerkortPanelOpen: false,
            };
        default:
            return state;
    }
}
