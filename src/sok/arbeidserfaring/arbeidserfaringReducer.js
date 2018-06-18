/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../domene';

export const SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING';
export const REMOVE_SELECTED_ARBEIDSERFARING = 'REMOVE_SELECTED_ARBEIDSERFARING';

export const CHECK_TOTAL_ERFARING = 'CHECK_TOTAL_ERFARING';
export const UNCHECK_TOTAL_ERFARING = 'UNCHECK_TOTAL_ERFARING';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    arbeidserfaringer: [],
    totalErfaring: []
};

export default function arbeidserfaringReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                arbeidserfaringer: action.query.arbeidserfaringer || [],
                totalErfaring: action.query.totalErfaring || ''
            };
        case SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.includes(action.value) ?
                    state.arbeidserfaringer :
                    [
                        ...state.arbeidserfaringer,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_ARBEIDSERFARING:
            return {
                ...state,
                arbeidserfaringer: state.arbeidserfaringer.filter((y) => y !== action.value)
            };
        case CHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: [...state.totalErfaring, action.value]
            };
        case UNCHECK_TOTAL_ERFARING:
            return {
                ...state,
                totalErfaring: state.totalErfaring.filter((te) => te !== action.value)
            };
        default:
            return state;
    }
}
