import { SET_STATE, harEnParameter, LUKK_ALLE_SOKEPANEL } from '../../reducer/searchReducer';

export const TOGGLE_TILRETTELEGGINGSBEHOV = 'TOGGLE_TILRETTELEGGINGSBEHOV';
export const CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER = 'CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER';
export const TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN = 'TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN';

export interface TilretteleggingsbehovState {
    harTilretteleggingsbehov?: boolean;
    kategorier?: string[];
    tilretteleggingsbehovPanelOpen: boolean;
}

const initialState = {
    harTilretteleggingsbehov: false,
    tilretteleggingsbehovPanelOpen: false,
    kategorier: [],
};

export default function tilretteleggingsbehovReducer(
    state: TilretteleggingsbehovState = initialState,
    action: any
) {
    switch (action.type) {
        case SET_STATE: {
            const { tilretteleggingsbehov, kategorier } = action.query;

            return {
                ...state,
                harTilretteleggingsbehov: tilretteleggingsbehov || false,
                kategorier: kategorier || [],
                tilretteleggingsbehovPanelOpen:
                    harEnParameter(kategorier) ||
                    tilretteleggingsbehov ||
                    state.tilretteleggingsbehovPanelOpen,
            };
        }
        case TOGGLE_TILRETTELEGGINGSBEHOV:
            return {
                ...state,
                harTilretteleggingsbehov: action.harTilretteleggingsbehov,
                kategorier: [],
            };
        case TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN:
            return {
                ...state,
                tilretteleggingsbehovPanelOpen: !state.tilretteleggingsbehovPanelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                tilretteleggingsbehovPanelOpen: false,
            };
        case CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER:
            return {
                ...state,
                kategorier: action.kategorier,
                harTilretteleggingsbehov: true,
            };
        default:
            return state;
    }
}
