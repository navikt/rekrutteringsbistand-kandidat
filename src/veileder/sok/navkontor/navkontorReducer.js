/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_NAVKONTOR = 'SELECT_TYPE_AHEAD_VALUE_NAVKONTOR';
export const REMOVE_SELECTED_NAVKONTOR = 'REMOVE_SELECTED_NAVKONTOR';

export const TOGGLE_NAVKONTOR_PANEL_OPEN = 'TOGGLE_NAVKONTOR_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    navkontor: [],
    navkontorPanelOpen: false
};

export default function navkontorReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                navkontor: action.query.navkontor || []
            };
        case SELECT_TYPE_AHEAD_VALUE_NAVKONTOR:
            return {
                ...state,
                navkontor: state.navkontor.includes(action.value) ?
                    state.navkontor :
                    [
                        ...state.navkontor,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_NAVKONTOR:
            return {
                ...state,
                navkontor: state.navkontor.filter((s) => s !== action.value)
            };
        case TOGGLE_NAVKONTOR_PANEL_OPEN:
            return {
                ...state,
                navkontorPanelOpen: !state.navkontorPanelOpen
            };
        default:
            return state;
    }
}
