/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter } from '../searchReducer';
import { LUKK_ALLE_SOKEPANEL } from '../konstanter';

export const SELECT_TYPE_AHEAD_VALUE_SPRAK = 'SELECT_TYPE_AHEAD_VALUE_SPRAK';
export const REMOVE_SELECTED_SPRAK = 'REMOVE_SELECTED_SPRAK';

export const TOGGLE_SPRAK_PANEL_OPEN = 'TOGGLE_SPRAK_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    sprak: [],
    sprakPanelOpen: false,
};

export default function sprakReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                sprak: action.query.sprak || [],
                sprakPanelOpen: harEnParameter(action.query.sprak) || state.sprakPanelOpen,
            };
        case SELECT_TYPE_AHEAD_VALUE_SPRAK:
            return {
                ...state,
                sprak: state.sprak.includes(action.value)
                    ? state.sprak
                    : [...state.sprak, action.value],
            };
        case REMOVE_SELECTED_SPRAK:
            return {
                ...state,
                sprak: state.sprak.filter(s => s !== action.value),
            };
        case TOGGLE_SPRAK_PANEL_OPEN:
            return {
                ...state,
                sprakPanelOpen: !state.sprakPanelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                sprakPanelOpen: false,
            };
        default:
            return state;
    }
}
