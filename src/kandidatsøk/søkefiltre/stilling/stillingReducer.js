/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter, LUKK_ALLE_SOKEPANEL } from '../../reducer/searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_STILLING = 'SELECT_TYPE_AHEAD_VALUE_STILLING';
export const REMOVE_SELECTED_STILLING = 'REMOVE_SELECTED_STILLING';

export const TOGGLE_STILLING_PANEL_OPEN = 'TOGGLE_STILLING_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    stillinger: [],
    stillingPanelOpen: false,
};

export default function stillingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
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
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                stillingPanelOpen: false,
            };
        default:
            return state;
    }
}
