import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { OppstartstidspunktState } from './sok/oppstardstidspunkt/oppstartstidspunktReducer';
import { ArbeidserfaringState, TypeaheadState } from './sok/arbeidserfaring/arbeidserfaringState';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    oppstartstidspunkter: OppstartstidspunktState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
};

export default AppState;
