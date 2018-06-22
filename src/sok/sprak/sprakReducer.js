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
    sprakList: []
};

export default function sprakReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                sprakList: action.query.sprakList || []
            };
        case SELECT_TYPE_AHEAD_VALUE_SPRAK:
            return {
                ...state,
                sprakList: state.sprakList.includes(action.value) ?
                    state.sprakList :
                    [
                        ...state.sprakList,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_SPRAK:
            return {
                ...state,
                sprakList: state.sprakList.filter((s) => s !== action.value)
            };
        default:
            return state;
    }
}
