import { MidlertidigUtilgjengeligState } from './cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { OppstartstidspunktState } from './sok/oppstardstidspunkt/oppstartstidspunktReducer';
import { ArbeidserfaringState, TypeaheadState } from './sok/arbeidserfaring/arbeidserfaringState';
import { CvState } from './cv/reducer/cvReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    oppstartstidspunkter: OppstartstidspunktState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
    cv: CvState;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligState;
};

export default AppState;
