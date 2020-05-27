import { LUKK_ALLE_SOKEPANEL, SET_STATE } from '../searchReducer';
import { FellesSøkekriterieActions } from '../typedSearchReducer';

export enum AlderActionType {
    ToggleAlderPanel = 'ToggleAlderPanel',
    SetFraAlder = 'SetFraAlder',
    SetTilAlder = 'SetTilAlder',
}

interface ToggleAlderPanelActionType {
    type: AlderActionType.ToggleAlderPanel;
}

interface SetFraAlderActionType {
    type: AlderActionType.SetFraAlder;
    fra: number | undefined;
}

interface SetTilAlderActionType {
    type: AlderActionType.SetTilAlder;
    til: number | undefined;
}

type AlderAction =
    | ToggleAlderPanelActionType
    | SetFraAlderActionType
    | SetTilAlderActionType
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
        case AlderActionType.SetFraAlder: {
            return { ...state, fra: action.fra };
        }
        case AlderActionType.SetTilAlder: {
            return { ...state, til: action.til };
        }
        case AlderActionType.ToggleAlderPanel: {
            return { ...state, panelOpen: !state.panelOpen };
        }
        case LUKK_ALLE_SOKEPANEL: {
            return { ...state, panelOpen: false };
        }
        case SET_STATE: {
            const { fra, til } = action.query.alder;
            return { fra, til, panelOpen: fra !== undefined || til !== undefined };
        }
    }
};
