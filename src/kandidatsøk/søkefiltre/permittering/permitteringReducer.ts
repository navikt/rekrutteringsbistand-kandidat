import { KandidatsøkActionType } from '../../reducer/searchReducer';

export enum PermitteringActionType {
    SET_PERMITTERT = 'SET_PERMITTERT',
    TOGGLE_PERMITTERING_PANEL = 'TOGGLE_PERMITTERING_PANEL',
}

export type PermitteringState = {
    permittert: boolean;
    ikkePermittert: boolean;
    panelOpen: boolean;
};

export type PermitteringAction =
    | {
          type: PermitteringActionType.SET_PERMITTERT;
          permittert: boolean;
          ikkePermittert: boolean;
      }
    | {
          type: PermitteringActionType.TOGGLE_PERMITTERING_PANEL;
      };

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
        case PermitteringActionType.SET_PERMITTERT:
            return {
                ...state,
                permittert: action.permittert,
                ikkePermittert: action.ikkePermittert,
            };
        case PermitteringActionType.TOGGLE_PERMITTERING_PANEL:
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
