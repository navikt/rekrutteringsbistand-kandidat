/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE, harEnParameter } from '../searchReducer';

export const CHECK_INNSATSGRUPPE = 'CHECK_INNSATSGRUPPE';
export const UNCHECK_INNSATSGRUPPE = 'UNCHECK_INNSATSGRUPPE';

export const TOGGLE_INNSATSGRUPPE_PANEL_OPEN = 'TOGGLE_INNSATSGRUPPE_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    kvalifiseringsgruppeKoder: [],
    innsatsgruppePanelOpen: false
};

export default function innsatsgruppeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                kvalifiseringsgruppeKoder: action.query.kvalifiseringsgruppeKoder || [],
                innsatsgruppePanelOpen:
                    harEnParameter(action.query.kvalifiseringsgruppeKoder) ||
                    state.innsatsgruppePanelOpen
            };
        case CHECK_INNSATSGRUPPE:
            return {
                ...state,
                kvalifiseringsgruppeKoder: [...state.kvalifiseringsgruppeKoder, action.value]
            };
        case UNCHECK_INNSATSGRUPPE:
            return {
                ...state,
                kvalifiseringsgruppeKoder: state.kvalifiseringsgruppeKoder.filter((u) => u !== action.value)
            };
        case TOGGLE_INNSATSGRUPPE_PANEL_OPEN:
            return {
                ...state,
                innsatsgruppePanelOpen: !state.innsatsgruppePanelOpen
            };
        default:
            return state;
    }
}
