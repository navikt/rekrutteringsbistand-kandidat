import { SET_STATE } from '../searchReducer';
import { LUKK_ALLE_SOKEPANEL } from '../konstanter';

export enum PermitteringActionType {
    SET_PERMITTERT = 'SET_PERMITTERT',
    TOGGLE_PANEL = 'TOGGLE_PANEL',
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
          type: PermitteringActionType.TOGGLE_PANEL;
      };

const initialState = {
    permittert: false,
    ikkePermittert: false,
    panelOpen: false,
};

export default function permitteringReducer(state: PermitteringState = initialState, action) {
    switch (action.type) {
        case SET_STATE: {
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
        case PermitteringActionType.TOGGLE_PANEL:
            return {
                ...state,
                panelOpen: !state.panelOpen,
            };
        case LUKK_ALLE_SOKEPANEL:
            return {
                ...state,
                panelOpen: false,
            };
        default:
            return state;
    }
}
