/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_SPRAK = 'SELECT_TYPE_AHEAD_VALUE_SPRAK';
export const REMOVE_SELECTED_SPRAK = 'REMOVE_SELECTED_SPRAK';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    sprak: []
};

export default function sprakReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                sprak: action.query.sprak || []
            };
        case SELECT_TYPE_AHEAD_VALUE_SPRAK:
            return {
                ...state,
                sprak: state.sprak.includes(action.value) ?
                    state.sprak :
                    [
                        ...state.sprak,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_SPRAK:
            return {
                ...state,
                sprak: state.sprak.filter((s) => s !== action.value)
            };
        default:
            return state;
    }
}
