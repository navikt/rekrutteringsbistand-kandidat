import { Oppstartstidspunkt } from './OppstartstidspunktSearch';
import { harEnParameter, LUKK_ALLE_SOKEPANEL, SET_STATE } from '../searchReducer';

export type OppstartstidspunktState = {
    panelOpen: boolean;
    oppstartstidspunkter: Oppstartstidspunkt[];
};

export enum OppstartstidspunktActionType {
    CHECK_OPPSTARTSTIDSPUNKT = 'CHECK_OPPSTARTSTIDSPUNKT',
    UNCHECK_OPPSTARTSTIDSPUNKT = 'UNCHECK_OPPSTARTSTIDSPUNKT',
    TOGGLE_OPPSTARTSTIDSPUNKT_OPEN = 'TOGGLE_OPPSTARTSTIDSPUNKT_OPEN',
}

export type OppstartstidspunktAction =
    | {
          type:
              | OppstartstidspunktActionType.CHECK_OPPSTARTSTIDSPUNKT
              | OppstartstidspunktActionType.UNCHECK_OPPSTARTSTIDSPUNKT;
          value: Oppstartstidspunkt;
      }
    | {
          type: OppstartstidspunktActionType.TOGGLE_OPPSTARTSTIDSPUNKT_OPEN;
      };

const initialState = {
    panelOpen: false,
    oppstartstidspunkter: [],
};

const oppstartstidspunktReducer = (
    state: OppstartstidspunktState = initialState,
    action
): OppstartstidspunktState => {
    switch (action.type) {
        case SET_STATE: {
            return {
                oppstartstidspunkter: action.query.oppstartstidspunkter || [],
                panelOpen: harEnParameter(action.query.oppstartstidspunkter) || state.panelOpen,
            };
        }
        case OppstartstidspunktActionType.CHECK_OPPSTARTSTIDSPUNKT:
            return {
                ...state,
                oppstartstidspunkter: [...state.oppstartstidspunkter, action.value],
            };
        case OppstartstidspunktActionType.UNCHECK_OPPSTARTSTIDSPUNKT:
            return {
                ...state,
                oppstartstidspunkter: state.oppstartstidspunkter.filter(
                    (tidspunkt) => tidspunkt !== action.value
                ),
            };
        case OppstartstidspunktActionType.TOGGLE_OPPSTARTSTIDSPUNKT_OPEN:
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
};

export default oppstartstidspunktReducer;
