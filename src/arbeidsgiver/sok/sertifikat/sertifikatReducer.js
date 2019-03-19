/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT = 'SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT';
export const REMOVE_SELECTED_SERTIFIKAT = 'REMOVE_SELECTED_SERTIFIKAT';

export const TOGGLE_SERTIFIKAT_PANEL_OPEN = 'TOGGLE_SERTIFIKAT_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    sertifikat: [],
    sertifikatPanelOpen: true
};

export default function sertifikatReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                sertifikat: action.query.sertifikat || []
            };
        case SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT:
            return {
                ...state,
                sertifikat: state.sertifikat.includes(action.value) ?
                    state.sertifikat :
                    [
                        ...state.sertifikat,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_SERTIFIKAT:
            return {
                ...state,
                sertifikat: state.sertifikat.filter((s) => s !== action.value)
            };
        case TOGGLE_SERTIFIKAT_PANEL_OPEN:
            return {
                ...state,
                sertifikatPanelOpen: !state.sertifikatPanelOpen
            };
        default:
            return state;
    }
}
