/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_INITIAL_STATE } from '../domene';

export const SELECT_TYPE_AHEAD_VALUE_KOMPETANSE = 'SELECT_TYPE_AHEAD_VALUE_KOMPETANSE';
export const REMOVE_SELECTED_KOMPETANSE = 'REMOVE_SELECTED_KOMPETANSE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    kompetanser: []
};

export default function kompetanseReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                kompetanser: action.query.kompetanser || []
            };
        case SELECT_TYPE_AHEAD_VALUE_KOMPETANSE:
            return {
                ...state,
                kompetanser: state.kompetanser.includes(action.value) ?
                    state.kompetanser :
                    [
                        ...state.kompetanser,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_KOMPETANSE:
            return {
                ...state,
                kompetanser: state.kompetanser.filter((k) => k !== action.value)
            };
        default:
            return {
                ...state
            };
    }
}
