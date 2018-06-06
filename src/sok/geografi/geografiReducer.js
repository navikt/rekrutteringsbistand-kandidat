/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_INITIAL_STATE } from '../domene';

export const SELECT_TYPE_AHEAD_VALUE_GEOGRAFI = 'SELECT_TYPE_AHEAD_VALUE_GEOGRAFI';
export const REMOVE_SELECTED_GEOGRAFI = 'REMOVE_SELECTED_GEOGRAFI';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    geografiList: [],
    geografiListKomplett: []
};

export default function utdanningReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                geografiList: action.query.geografiList || [],
                geografiListKomplett: action.query.geografiListKomplett || []
            };
        case SELECT_TYPE_AHEAD_VALUE_GEOGRAFI:
            return {
                ...state,
                geografiList: state.geografiList.includes(action.value.geografiKode) ?
                    state.geografiList :
                    [
                        ...state.geografiList,
                        action.value.geografiKode
                    ],
                geografiListKomplett: state.geografiListKomplett
                    .find((v) => v.geografiKode === action.value.geografiKode) !== undefined ?
                    state.geografiListKomplett :
                    [
                        ...state.geografiListKomplett,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_GEOGRAFI:
            return {
                ...state,
                geografiList: state.geografiList.filter((g) => g !== action.value),
                geografiListKomplett: state.geografiListKomplett
                    .filter((g) => g.geografiKode !== action.value)
            };
        default:
            return state;
    }
}
