/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_GEOGRAFI = 'SELECT_TYPE_AHEAD_VALUE_GEOGRAFI';
export const REMOVE_SELECTED_GEOGRAFI = 'REMOVE_SELECTED_GEOGRAFI';

export const TOGGLE_GEOGRAFI_PANEL_OPEN = 'TOGGLE_GEOGRAFI_PANEL_OPEN';

export const TOGGLE_MA_BO_INNENFOR_GEOGRAFI = 'TOGGLE_MA_BO_INNENFOR_GEOGRAFI';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    geografiList: [],
    geografiListKomplett: [],
    geografiPanelOpen: undefined,
    maaBoInnenforGeografi: false
};

export default function geografiReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                geografiList: action.query.geografiList || [],
                geografiListKomplett: action.query.geografiListKomplett || [],
                maaBoInnenforGeografi: action.query.maaBoInnenforGeografi || false
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
        case TOGGLE_GEOGRAFI_PANEL_OPEN:
            return {
                ...state,
                geografiPanelOpen: !state.geografiPanelOpen
            };
        case TOGGLE_MA_BO_INNENFOR_GEOGRAFI:
            return {
                ...state,
                maaBoInnenforGeografi: !state.maaBoInnenforGeografi
            };
        default:
            return state;
    }
}
