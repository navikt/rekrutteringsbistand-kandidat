import { KandidatsøkActionType } from '../../reducer/searchReducer';
import { FellesSøkekriterieActions } from '../../reducer/searchSaga';

export enum AlderActionType {
    ToggleAlderPanel = 'ToggleAlderPanel',
    SetAlder = 'SetAlder',
}

interface ToggleAlderPanelActionType {
    type: AlderActionType.ToggleAlderPanel;
}

interface SetAlderActionType {
    type: AlderActionType.SetAlder;
    fra: number | undefined;
    til: number | undefined;
}

export type AlderAction =
    | ToggleAlderPanelActionType
    | SetAlderActionType
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
        case AlderActionType.SetAlder: {
            return { ...state, fra: action.fra, til: action.til };
        }
        case AlderActionType.ToggleAlderPanel: {
            return { ...state, panelOpen: !state.panelOpen };
        }
        case KandidatsøkActionType.LukkAlleSokepanel: {
            return { ...state, panelOpen: false };
        }
        case KandidatsøkActionType.SetState: {
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
