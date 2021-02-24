import { harEnParameter, LUKK_ALLE_SOKEPANEL, SET_STATE } from '../../reducer/searchReducer';
import { Oppstartstidspunkt } from './oppstardstidspunkt/OppstartstidspunktSearch';
import { Tilgjengelighet } from '../../kandidater-tabell/Søkeresultat';

export interface TilgjengelighetState {
    panelOpen: boolean;
    oppstartstidspunkter: Oppstartstidspunkt[];
    midlertidigUtilgjengelig: Tilgjengelighet[];
}

export enum TilgjengelighetAction {
    ToggleTilgjengelighetOpen = 'TOGGLE_TILGJENGELIGHET_OPEN',
    CheckOppstartstidspunkt = 'CHECK_OPPSTARTSTIDSPUNKT',
    UncheckOppstartstidspunkt = 'UNCHECK_OPPSTARTSTIDSPUNKT',
    CheckMidlertidigUtilgjengelig = 'CHECK_MIDLERTIDIG_UTILGJENGELIG',
    UncheckMidlertidigUtilgjengelig = 'UNCHECK_MIDLERTIDIG_UTILGJENGELIG',
}

const initialState: TilgjengelighetState = {
    panelOpen: false,
    oppstartstidspunkter: [],
    midlertidigUtilgjengelig: [],
};

const tilgjengelighetReducer = (
    state: TilgjengelighetState = initialState,
    action
): TilgjengelighetState => {
    switch (action.type) {
        case SET_STATE: {
            return {
                panelOpen:
                    harEnParameter(action.query.oppstartstidspunkter) ||
                    harEnParameter(action.query.midlertidigUtilgjengelig) ||
                    state.panelOpen,
                oppstartstidspunkter: action.query.oppstartstidspunkter || [],
                midlertidigUtilgjengelig: action.query.midlertidigUtilgjengelig || [],
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
        case TilgjengelighetAction.CheckMidlertidigUtilgjengelig:
            return {
                ...state,
                midlertidigUtilgjengelig: [...state.midlertidigUtilgjengelig, action.value],
            };
        case TilgjengelighetAction.UncheckMidlertidigUtilgjengelig:
            return {
                ...state,
                midlertidigUtilgjengelig: state.midlertidigUtilgjengelig.filter(
                    (midlertidigUtilgjengelig) => midlertidigUtilgjengelig !== action.value
                ),
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

export default tilgjengelighetReducer;
