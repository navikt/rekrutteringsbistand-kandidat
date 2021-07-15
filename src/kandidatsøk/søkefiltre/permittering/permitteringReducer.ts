import { KandidatsøkActionType } from '../../reducer/searchActions';

export enum PermitteringActionType {
    SetPermittert = 'SET_PERMITTERT',
    TogglePermitteringPanel = 'TOGGLE_PERMITTERING_PANEL',
}

export type PermitteringState = {
    permittert: boolean;
    ikkePermittert: boolean;
    panelOpen: boolean;
};

type SetPermittertAction = {
    type: PermitteringActionType.SetPermittert;
    permittert: boolean;
    ikkePermittert: boolean;
};

type TogglePermitteringPanelAction = {
    type: PermitteringActionType.TogglePermitteringPanel;
};

export type PermitteringAction = SetPermittertAction | TogglePermitteringPanelAction;

const initialState = {
    permittert: false,
    ikkePermittert: false,
    panelOpen: false,
};

export default function permitteringReducer(state: PermitteringState = initialState, action) {
    switch (action.type) {
        case KandidatsøkActionType.SetState: {
            const { permittert } = action.query;

            return {
                permittert: permittert === true,
                ikkePermittert: permittert === false,
                panelOpen: permittert !== undefined || state.panelOpen,
            };
        }
        case PermitteringActionType.SetPermittert:
            return {
                ...state,
                permittert: action.permittert,
                ikkePermittert: action.ikkePermittert,
            };
        case PermitteringActionType.TogglePermitteringPanel:
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
