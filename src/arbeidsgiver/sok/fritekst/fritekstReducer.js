/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const SET_FRITEKST_SOKEORD = 'SET_FRITEKST_SOKEORD';
export const TOGGLE_FRITEKST_PANEL = 'TOGGLE_FRITEKST_PANEL';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    fritekst: '',
    panelOpen: true
};

export default function fritekstReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                fritekst: action.query.fritekst || ''
            };
        case SET_FRITEKST_SOKEORD:
            return {
                ...state,
                fritekst: action.fritekst
            };
        case TOGGLE_FRITEKST_PANEL:
            return {
                ...state,
                panelOpen: !state.panelOpen
            };
        default:
            return state;
    }
}
