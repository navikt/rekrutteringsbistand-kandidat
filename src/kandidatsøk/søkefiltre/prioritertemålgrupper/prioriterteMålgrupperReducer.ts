import { LUKK_ALLE_SOKEPANEL, SET_STATE } from '../../reducer/searchReducer';

export const CHANGE_PRIORITERTE_MÅLGRUPPER = 'CHANGE_PRIORITERTE_MÅLGRUPPER';
export const TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN = 'TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN';

export interface PrioriterteMålgrupperState {
    prioriterteMålgrupperPanelOpen: boolean;
    valgte: string[];
}

const initialState = {
    prioriterteMålgrupperPanelOpen: false,
    valgte: [],
};

export default function prioriterteMålgrupperReducer(
    state: PrioriterteMålgrupperState = initialState,
    action: any
) {
    switch (action.type) {
        case SET_STATE: {
            const valgteMålgrupper = action.query.prioriterteMålgrupper;

            return {
                ...state,
                valgte: valgteMålgrupper || [],
                prioriterteMålgrupperPanelOpen: valgteMålgrupper,
            };
        }
        case TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN:
            return {
                ...state,
                prioriterteMålgrupperPanelOpen: !state.prioriterteMålgrupperPanelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                prioriterteMålgrupperPanelOpen: false,
            };
        case CHANGE_PRIORITERTE_MÅLGRUPPER:
            return {
                ...state,
                valgte: action.valgteMålgrupper,
            };
        default:
            return state;
    }
}
