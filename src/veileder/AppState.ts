import { MidlertidigUtilgjengeligState } from './cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { ArbeidserfaringState, TypeaheadState } from './sok/arbeidserfaring/arbeidserfaringReducer';
import { CvState } from './cv/reducer/cvReducer';
import { TilgjengelighetState } from './sok/tilgjengelighet/tilgjengelighetReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    tilgjengelighet: TilgjengelighetState;
    search: any;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
    cv: CvState;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligState;
};

export default AppState;
