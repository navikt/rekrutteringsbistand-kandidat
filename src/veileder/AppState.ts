import { MidlertidigUtilgjengeligState } from './cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { OppstartstidspunktState } from './sok/oppstardstidspunkt/oppstartstidspunktReducer';
import { ArbeidserfaringState, TypeaheadState } from './sok/arbeidserfaring/arbeidserfaringReducer';
import { CvState } from './cv/reducer/cvReducer';
import { MidlertidigUtilgjengeligSearchState } from './sok/oppstardstidspunkt/midlertidig-utilgjengelig/midlertidigUtilgjengeligSearchReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    tilgjengelighet;
    oppstartstidspunkter: OppstartstidspunktState;
    midlertidigUtilgjengeligSearch: MidlertidigUtilgjengeligSearchState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
    cv: CvState;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligState;
};

export default AppState;
