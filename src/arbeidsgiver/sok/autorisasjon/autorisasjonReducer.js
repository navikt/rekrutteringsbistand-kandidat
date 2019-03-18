/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_AUTORISASJON = 'SELECT_TYPE_AHEAD_VALUE_AUTORISASJON';
export const REMOVE_SELECTED_AUTORISASJON = 'REMOVE_SELECTED_AUTORISASJON';

export const TOGGLE_AUTORISASJON_PANEL_OPEN = 'TOGGLE_AUTORISASJON_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    autorisasjon: [],
    autorisasjonPanelOpen: true
};

export default function autorisasjonReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                autorisasjon: action.query.autorisasjon || []
            };
        case SELECT_TYPE_AHEAD_VALUE_AUTORISASJON:
            return {
                ...state,
                autorisasjon: state.autorisasjon.includes(action.value) ?
                    state.autorisasjon :
                    [
                        ...state.autorisasjon,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_AUTORISASJON:
            return {
                ...state,
                autorisasjon: state.autorisasjon.filter((s) => s !== action.value)
            };
        case TOGGLE_AUTORISASJON_PANEL_OPEN:
            return {
                ...state,
                autorisasjonPanelOpen: !state.autorisasjonPanelOpen
            };
        default:
            return state;
    }
}
