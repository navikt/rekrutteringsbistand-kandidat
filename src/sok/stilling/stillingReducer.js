/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_INITIAL_STATE } from '../domene';

export const SELECT_TYPE_AHEAD_VALUE_STILLING = 'SELECT_TYPE_AHEAD_VALUE_STILLING';
export const REMOVE_SELECTED_STILLING = 'REMOVE_SELECTED_STILLING';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    stillinger: []
};

export default function stillingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                stillinger: action.query.stillinger || []
            };
        case SELECT_TYPE_AHEAD_VALUE_STILLING:
            return {
                ...state,
                stillinger: state.stillinger.includes(action.value) ?
                    state.stillinger :
                    [
                        ...state.stillinger,
                        action.value
                    ],
                // TODO: Call typeaheadReducer here?
                typeAheadSuggestionsstilling: []
            };
        case REMOVE_SELECTED_STILLING:
            return {
                ...state,
                stillinger: state.stillinger.filter((y) => y !== action.value)
            };
        default:
            return {
                ...state
            };
    }
}
