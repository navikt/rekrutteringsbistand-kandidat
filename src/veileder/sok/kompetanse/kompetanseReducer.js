/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter, LUKK_ALLE_SOKEPANEL } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_KOMPETANSE = 'SELECT_TYPE_AHEAD_VALUE_KOMPETANSE';
export const REMOVE_SELECTED_KOMPETANSE = 'REMOVE_SELECTED_KOMPETANSE';

export const TOGGLE_KOMPETANSE_PANEL_OPEN = 'TOGGLE_KOMPETANSE_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    kompetanser: [],
    kompetansePanelOpen: false,
};

export default function kompetanseReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                kompetanser: action.query.kompetanser || [],
                kompetansePanelOpen:
                    harEnParameter(action.query.kompetanser) || state.kompetansePanelOpen,
            };
        case SELECT_TYPE_AHEAD_VALUE_KOMPETANSE:
            return {
                ...state,
                kompetanser: state.kompetanser.includes(action.value)
                    ? state.kompetanser
                    : [...state.kompetanser, action.value],
            };
        case REMOVE_SELECTED_KOMPETANSE:
            return {
                ...state,
                kompetanser: state.kompetanser.filter(k => k !== action.value),
            };
        case TOGGLE_KOMPETANSE_PANEL_OPEN:
            return {
                ...state,
                kompetansePanelOpen: !state.kompetansePanelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                kompetansePanelOpen: false,
            };
        default:
            return state;
    }
}
