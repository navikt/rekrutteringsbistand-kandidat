import { SET_STATE } from '../searchReducer';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const TOGGLE_TILRETTELEGGINGSBEHOV = 'TOGGLE_TILRETTELEGGINGSBEHOV';
export const CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER = 'CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER';
export const TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN = 'TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    harTilretteleggingsbehov: false,
    tilretteleggingsbehovPanelOpen: false,
    kategorier: []
};

export default function tilretteleggingsbehovReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                harTilretteleggingsbehov: action.query.tilretteleggingsbehov || false
            };
        case TOGGLE_TILRETTELEGGINGSBEHOV:
            return {
                ...state,
                harTilretteleggingsbehov: action.harTilretteleggingsbehov,
                kategorier: []
            };
        case TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN:
            return {
                ...state,
                tilretteleggingsbehovPanelOpen: !state.tilretteleggingsbehovPanelOpen
            };
        case CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER:
            return {
                ...state,
                kategorier: action.kategorier,
                harTilretteleggingsbehov: true
            };
        default:
            return state;
    }
}
