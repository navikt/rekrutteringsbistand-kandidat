import { KandidatsøkActionType } from '../../reducer/searchActions';
import { harEnParameter } from '../../reducer/searchReducer';

export const CHECK_TOTAL_HOVEDMAL = 'CHECK_TOTAL_HOVEDMAL';
export const UNCHECK_TOTAL_HOVEDMAL = 'UNCHECK_TOTAL_HOVEDMAL';

export const TOGGLE_HOVEDMAL_PANEL_OPEN = 'TOGGLE_HOVEDMAL_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    totaltHovedmal: [],
    panelOpen: false,
};

export default function hovedmalReducer(state = initialState, action) {
    switch (action.type) {
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                totaltHovedmal: action.query.hovedmal || [],
                panelOpen: harEnParameter(action.query.hovedmal) || state.panelOpen,
            };
        case CHECK_TOTAL_HOVEDMAL:
            return {
                ...state,
                totaltHovedmal: [...state.totaltHovedmal, action.value],
            };
        case UNCHECK_TOTAL_HOVEDMAL:
            return {
                ...state,
                totaltHovedmal: state.totaltHovedmal.filter((th) => th !== action.value),
            };
        case TOGGLE_HOVEDMAL_PANEL_OPEN:
            return {
                ...state,
                panelOpen: !state.panelOpen,
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                panelOpen: false,
            };
        default:
            return state;
    }
}
