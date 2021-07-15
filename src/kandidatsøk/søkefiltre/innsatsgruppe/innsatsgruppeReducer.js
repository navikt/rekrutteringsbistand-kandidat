import { KandidatsøkActionType } from '../../reducer/searchActions';
import { harEnParameter } from '../../reducer/searchReducer';

export const CHECK_INNSATSGRUPPE = 'CHECK_INNSATSGRUPPE';
export const UNCHECK_INNSATSGRUPPE = 'UNCHECK_INNSATSGRUPPE';

export const TOGGLE_INNSATSGRUPPE_PANEL_OPEN = 'TOGGLE_INNSATSGRUPPE_PANEL_OPEN';

const initialState = {
    kvalifiseringsgruppeKoder: [],
    innsatsgruppePanelOpen: false,
};

export default function innsatsgruppeReducer(state = initialState, action) {
    switch (action.type) {
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                kvalifiseringsgruppeKoder: action.query.kvalifiseringsgruppeKoder || [],
                innsatsgruppePanelOpen:
                    harEnParameter(action.query.kvalifiseringsgruppeKoder) ||
                    state.innsatsgruppePanelOpen,
            };
        case CHECK_INNSATSGRUPPE:
            return {
                ...state,
                kvalifiseringsgruppeKoder: [...state.kvalifiseringsgruppeKoder, action.value],
            };
        case UNCHECK_INNSATSGRUPPE:
            return {
                ...state,
                kvalifiseringsgruppeKoder: state.kvalifiseringsgruppeKoder.filter(
                    (u) => u !== action.value
                ),
            };
        case TOGGLE_INNSATSGRUPPE_PANEL_OPEN:
            return {
                ...state,
                innsatsgruppePanelOpen: !state.innsatsgruppePanelOpen,
            };
        case KandidatsøkActionType.LukkAlleSokepanel:
            return {
                ...state,
                innsatsgruppePanelOpen: false,
            };
        default:
            return state;
    }
}
