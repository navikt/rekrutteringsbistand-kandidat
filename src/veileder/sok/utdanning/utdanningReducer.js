/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_UTDANNING = 'SELECT_TYPE_AHEAD_VALUE_UTDANNING';
export const REMOVE_SELECTED_UTDANNING = 'REMOVE_SELECTED_UTDANNING';

export const CHECK_UTDANNINGSNIVA = 'CHECK_UTDANNINGSNIVA';
export const UNCHECK_UTDANNINGSNIVA = 'UNCHECK_UTDANNINGSNIVA';

export const TOGGLE_UTDANNING_PANEL_OPEN = 'TOGGLE_UTDANNING_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    utdanninger: [],
    utdanningsniva: [],
    utdanningPanelOpen: false
};

export default function utdanningReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                utdanninger: action.query.utdanninger || [],
                utdanningsniva: action.query.utdanningsniva || []
            };
        case SELECT_TYPE_AHEAD_VALUE_UTDANNING:
            return {
                ...state,
                utdanninger: state.utdanninger.includes(action.value) ?
                    state.utdanninger :
                    [
                        ...state.utdanninger,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_UTDANNING:
            return {
                ...state,
                utdanninger: state.utdanninger.filter((u) => u !== action.value)
            };
        case CHECK_UTDANNINGSNIVA:
            return {
                ...state,
                utdanningsniva: [...state.utdanningsniva, action.value]
            };
        case UNCHECK_UTDANNINGSNIVA:
            return {
                ...state,
                utdanningsniva: state.utdanningsniva.filter((u) => u !== action.value)
            };
        case TOGGLE_UTDANNING_PANEL_OPEN:
            return {
                ...state,
                utdanningPanelOpen: !state.utdanningPanelOpen
            };
        default:
            return state;
    }
}
