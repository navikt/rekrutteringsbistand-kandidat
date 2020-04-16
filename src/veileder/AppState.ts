import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { OppstartstidspunktState } from './sok/oppstardstidspunkt/oppstartstidspunktReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    oppstartstidspunkter: OppstartstidspunktState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
};

interface ArbeidserfaringState {
    arbeidserfaringPanelOpen: boolean;
    arbeidserfaringer: string[];
    totalErfaring: string[];
}

interface Typeahead {
    value: string;
    suggestions: string[];
}

interface TypeaheadState {
    kompetanse: Typeahead;
    stilling: Typeahead;
    arbeidserfaring: Typeahead;
    utdanning: Typeahead;
    geografi: Typeahead;
    geografiKomplett: Typeahead;
    sprak: Typeahead;
    forerkort: Typeahead;
    navkontor: Typeahead;
}

export default AppState;
