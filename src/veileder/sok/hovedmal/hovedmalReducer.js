/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_STATE } from '../searchReducer';

export const CHECK_TOTAL_HOVEDMAL = 'CHECK_TOTAL_HOVEDMAL';
export const UNCHECK_TOTAL_HOVEDMAL = 'UNCHECK_TOTAL_HOVEDMAL';

export const TOGGLE_HOVEDMAL_PANEL_OPEN = 'TOGGLE_HOVEDMAL_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    totaltHovedmal: [],
    panelOpen: false
};

export default function hovedmalReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                totaltHovedmal: action.query.totaltHovedmal || []
            };
        case CHECK_TOTAL_HOVEDMAL:
            return {
                ...state,
                totaltHovedmal: [...state.totaltHovedmal, action.value]
            };
        case UNCHECK_TOTAL_HOVEDMAL:
            return {
                ...state,
                totaltHovedmal: state.totaltHovedmal.filter((th) => th !== action.value)
            };
        case TOGGLE_HOVEDMAL_PANEL_OPEN:
            return {
                ...state,
                hovedmalPanelOpen: !state.hovedmalPanelOpen
            };
        default:
            return state;
    }
}
