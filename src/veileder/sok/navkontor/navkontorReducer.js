/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_NAVKONTOR = 'SELECT_TYPE_AHEAD_VALUE_NAVKONTOR';
export const REMOVE_SELECTED_NAVKONTOR = 'REMOVE_SELECTED_NAVKONTOR';

export const TOGGLE_NAVKONTOR_PANEL_OPEN = 'TOGGLE_NAVKONTOR_PANEL_OPEN';
export const TOGGLE_MINEKANDIDATER = 'TOGGLE_MINEKANDIDATER';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    navkontor: [],
    navkontorPanelOpen: false,
    minekandidater: false,
};

export default function navkontorReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                navkontor: action.query.navkontor || [],
                minekandidater: action.query.minekandidater || false,
                navkontorPanelOpen:
                    harEnParameter(action.query.navkontor) ||
                    action.query.minekandidater ||
                    state.navkontorPanelOpen,
            };
        case SELECT_TYPE_AHEAD_VALUE_NAVKONTOR:
            return {
                ...state,
                navkontor: state.navkontor.includes(action.value)
                    ? state.navkontor
                    : [...state.navkontor, action.value],
            };
        case REMOVE_SELECTED_NAVKONTOR:
            return {
                ...state,
                navkontor: state.navkontor.filter(s => s !== action.value),
            };
        case TOGGLE_NAVKONTOR_PANEL_OPEN:
            return {
                ...state,
                navkontorPanelOpen: !state.navkontorPanelOpen,
            };
        case TOGGLE_MINEKANDIDATER:
            return {
                ...state,
                minekandidater: !state.minekandidater,
            };
        default:
            return state;
    }
}
