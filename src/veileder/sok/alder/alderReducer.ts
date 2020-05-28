import { LUKK_ALLE_SOKEPANEL, SET_STATE } from '../searchReducer';
import { FellesSøkekriterieActions } from '../typedSearchReducer';

export enum AlderActionType {
    ToggleAlderPanel = 'ToggleAlderPanel',
    SetAlderFra = 'SetAlderFra',
    SetAlderTil = 'SetAlderTil',
}

interface ToggleAlderPanelActionType {
    type: AlderActionType.ToggleAlderPanel;
}

interface SetAlderFraActionType {
    type: AlderActionType.SetAlderFra;
    fra: number | undefined;
}

interface SetAlderTilActionType {
    type: AlderActionType.SetAlderTil;
    til: number | undefined;
}

export type AlderAction =
    | ToggleAlderPanelActionType
    | SetAlderFraActionType
    | SetAlderTilActionType
    | FellesSøkekriterieActions;

export interface AlderState {
    til: number | undefined;
    fra: number | undefined;
    panelOpen: boolean;
}

const initialState: AlderState = {
    til: undefined,
    fra: undefined,
    panelOpen: false,
};

export const alderReducer = (state: AlderState = initialState, action: AlderAction) => {
    switch (action.type) {
        case AlderActionType.SetAlderFra: {
            return { ...state, fra: action.fra };
        }
        case AlderActionType.SetAlderTil: {
            return { ...state, til: action.til };
        }
        case AlderActionType.ToggleAlderPanel: {
            return { ...state, panelOpen: !state.panelOpen };
        }
        case LUKK_ALLE_SOKEPANEL: {
            return { ...state, panelOpen: false };
        }
        case SET_STATE: {
            const { alderFra, alderTil } = action.query;
            return {
                fra: alderFra,
                til: alderTil,
                panelOpen: alderFra !== undefined || alderTil !== undefined,
            };
        }
        default:
            return state;
    }
};
