import { MidlertidigUtilgjengeligState } from './cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';
import { ArbeidserfaringState, TypeaheadState } from './sok/arbeidserfaring/arbeidserfaringReducer';
import { CvState } from './cv/reducer/cvReducer';
import { TilgjengelighetState } from './sok/tilgjengelighet/tilgjengelighetReducer';
import { SearchState } from './sok/typedSearchReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    tilgjengelighet: TilgjengelighetState;
    search: SearchState;
    arbeidserfaring: ArbeidserfaringState;
    typeahead: TypeaheadState;
    cv: CvState;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligState;

    fritekst: FritekstState;
    stilling: StillingState;
    kompetanse: KompetanseState;
    utdanning: UtdanningState;
    geografi: GeografiState;
    sprakReducer: SprakReducerState;
    forerkort: ForerkortState;
    innsatsgruppe: InnsatsgruppeState;
    navkontorReducer: NavkontorReducerState;
    hovedmal: HovedmalState;
    tilretteleggingsbehov: TilretteleggingsbehovState;
};

// TODO Følgende burde defineres i sine respektive reducere
export interface FritekstState {
    fritekst?: string;
}
export interface StillingState {
    stillinger?: string[];
}
export interface KompetanseState {
    kompetanser?: string[];
}
export interface UtdanningState {
    utdanninger?: string[];
    utdanningsniva?: string[];
}
export interface GeografiState {
    geografiList?: string[];
    maaBoInnenforGeografi?: boolean;
}
export interface SprakReducerState {
    sprak?: string[];
}
export interface ForerkortState {
    forerkortList?: string[];
}
export interface InnsatsgruppeState {
    kvalifiseringsgruppeKoder?: string[];
}
export interface NavkontorReducerState {
    navkontor?: string[];
    minekandidater?: boolean;
}
export interface HovedmalState {
    totaltHovedmal: string[];
}
export interface TilretteleggingsbehovState {
    harTilretteleggingsbehov?: boolean;
    kategorier?: string[];
}

export default AppState;
