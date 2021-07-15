import { KandidatsøkActionType } from '../../reducer/searchActions';

export const SET_FRITEKST_SOKEORD = 'SET_FRITEKST_SOKEORD';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    fritekst: '',
};

export default function fritekstReducer(state = initialState, action) {
    switch (action.type) {
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                fritekst: action.query.fritekst || '',
            };
        case SET_FRITEKST_SOKEORD:
            return {
                ...state,
                fritekst: action.fritekst,
            };
        default:
            return state;
    }
}
