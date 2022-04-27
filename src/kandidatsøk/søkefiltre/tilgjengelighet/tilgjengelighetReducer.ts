import { Oppstartstidspunkt } from './oppstardstidspunkt/OppstartstidspunktSearch';
import { harEnParameter } from '../../reducer/searchReducer';
import { KandidatsøkActionType } from '../../reducer/searchActions';

export interface TilgjengelighetState {
    panelOpen: boolean;
    oppstartstidspunkter: Oppstartstidspunkt[];
}

export enum TilgjengelighetAction {
    ToggleTilgjengelighetOpen = 'TOGGLE_TILGJENGELIGHET_OPEN',
    CheckOppstartstidspunkt = 'CHECK_OPPSTARTSTIDSPUNKT',
    UncheckOppstartstidspunkt = 'UNCHECK_OPPSTARTSTIDSPUNKT',
}

const initialState: TilgjengelighetState = {
    panelOpen: false,
    oppstartstidspunkter: [],
};

const tilgjengelighetReducer = (
    state: TilgjengelighetState = initialState,
    action
): TilgjengelighetState => {
    switch (action.type) {
        case KandidatsøkActionType.SetState: {
            return {
                panelOpen: harEnParameter(action.query.oppstartstidspunkter) || state.panelOpen,
                oppstartstidspunkter: action.query.oppstartstidspunkter || [],
            };
        }
        case TilgjengelighetAction.ToggleTilgjengelighetOpen:
            return {
                ...state,
                panelOpen: !state.panelOpen,
            };
        case TilgjengelighetAction.CheckOppstartstidspunkt:
            return {
                ...state,
                oppstartstidspunkter: [...state.oppstartstidspunkter, action.value],
            };
        case TilgjengelighetAction.UncheckOppstartstidspunkt:
            return {
                ...state,
                oppstartstidspunkter: state.oppstartstidspunkter.filter(
                    (tidspunkt) => tidspunkt !== action.value
                ),
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                panelOpen: false,
            };
        default:
            return state;
    }
};

export default tilgjengelighetReducer;
