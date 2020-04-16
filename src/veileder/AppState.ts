import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { OppstartstidspunktState } from './sok/oppstardstidspunkt/oppstartstidspunktReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    oppstartstidspunkter: OppstartstidspunktState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
};

interface ArbeidserfaringState {
    arbeidserfaringPanelOpen: boolean;
    arbeidserfaringer: string[];
    totalErfaring: string[];
}

export default AppState;
