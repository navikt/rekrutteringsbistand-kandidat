import { MidlertidigUtilgjengelig } from './MidlertidigUtilgjengeligSearch';
import { harEnParameter, LUKK_ALLE_SOKEPANEL, SET_STATE } from '../../searchReducer';

export type MidlertidigUtilgjengeligSearchState = {
    panelOpen: boolean;
    midlertidigUtilgjengelig: MidlertidigUtilgjengelig[];
};

export enum MidlertidigUtilgjengeligActionType {
    CheckMidlertidigUtilgjengelig = 'CHECK_MIDLERTIDIG_UTILGJENGELIG',
    UncheckMidlertidigUtilgjengelig = 'UNCHECK_MIDLERTIDIG_UTILGJENGELIG',
}

const initialState = {
    panelOpen: false,
    midlertidigUtilgjengelig: [],
};

const midlertidigUtilgjengeligSearchReducer = (
    state: MidlertidigUtilgjengeligSearchState = initialState,
    action
): MidlertidigUtilgjengeligSearchState => {
    switch (action.type) {
        case SET_STATE: {
            return {
                midlertidigUtilgjengelig: action.query.midlertidigUtilgjengelig || [],
                panelOpen: harEnParameter(action.query.midlertidigUtilgjengelig) || state.panelOpen,
            };
        }
        case MidlertidigUtilgjengeligActionType.CheckMidlertidigUtilgjengelig:
            return {
                ...state,
                midlertidigUtilgjengelig: [...state.midlertidigUtilgjengelig, action.value],
            };
        case MidlertidigUtilgjengeligActionType.UncheckMidlertidigUtilgjengelig:
            return {
                ...state,
                midlertidigUtilgjengelig: state.midlertidigUtilgjengelig.filter(
                    (midlertidigUtilgjengelig) => midlertidigUtilgjengelig !== action.value
                ),
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                panelOpen: false,
            };
        default:
            return state;
    }
};

export default midlertidigUtilgjengeligSearchReducer;
