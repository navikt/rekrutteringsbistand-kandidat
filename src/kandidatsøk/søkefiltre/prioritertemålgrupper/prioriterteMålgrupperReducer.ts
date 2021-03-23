import { harEnParameter, LUKK_ALLE_SOKEPANEL, SET_STATE } from '../../reducer/searchReducer';

export const TOGGLE_PRIORITERTE_MÅLGRUPPER = 'TOGGLE_PRIORITERTE_MÅLGRUPPER';
export const CHANGE_PRIORITERTE_MÅLGRUPPER_KATEGORIER = 'CHANGE_PRIORITERTE_MÅLGRUPPER_KATEGORIER';
export const TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN = 'TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN';

export interface PrioriterteMålgrupperState {
    prioriterteMålgrupperPanelOpen: boolean;
    kategorier?: string[];
    harHullICv: boolean;
}

const initialState = {
    prioriterteMålgrupperPanelOpen: false,
    harHullICv: false,
};

export default function prioriterteMålgrupperReducer(
    state: PrioriterteMålgrupperState = initialState,
    action: any
) {
    switch (action.type) {
        case SET_STATE: {
            const { prioriterteMålgrupper, kategorier } = action.query;

            return {
                ...state,
                kategorier: kategorier || [],
                prioriterteMålgrupperPanelOpen:
                    harEnParameter(kategorier) ||
                    prioriterteMålgrupper ||
                    state.prioriterteMålgrupperPanelOpen,
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
        case CHANGE_PRIORITERTE_MÅLGRUPPER_KATEGORIER:
            return {
                ...state,
                kategorier: action.kategorier,
            };
        default:
            return state;
    }
}
