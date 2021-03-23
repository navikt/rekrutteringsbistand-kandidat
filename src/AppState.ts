import { ListeoversiktState } from './listeoversikt/reducer/listeoversiktReducer';
import { AlderState } from './kandidatsøk/søkefiltre/alder/alderReducer';
import {
    ArbeidserfaringState,
    TypeaheadState,
} from './kandidatsøk/søkefiltre/arbeidserfaring/arbeidserfaringReducer';
import { CvState } from './kandidatside/cv/reducer/cvReducer';
import { Geografi } from './kandidatsøk/fant-få-kandidater/FantFåKandidater';
import { HistorikkState } from './kandidatside/historikk/historikkReducer';
import { KandidatlisteState } from './kandidatliste/reducer/kandidatlisteReducer';
import { MidlertidigUtilgjengeligState } from './kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { NavKontorState } from './navKontor/navKontorReducer';
import { PermitteringState } from './kandidatsøk/søkefiltre/permittering/permitteringReducer';
import { SearchState } from './kandidatsøk/reducer/typedSearchReducer';
import { TilgjengelighetState } from './kandidatsøk/søkefiltre/tilgjengelighet/tilgjengelighetReducer';
import { TilretteleggingsbehovState } from './kandidatsøk/søkefiltre/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import { PrioriterteMålgrupperState } from './kandidatsøk/søkefiltre/prioritertemålgrupper/prioriterteMålgrupperReducer';

type AppState = {
    cv: CvState;
    enhetsregister: any;
    historikk: HistorikkState;
    kandidatliste: KandidatlisteState;
    listeoversikt: ListeoversiktState;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligState;
    navKontor: NavKontorState;
    søk: SearchState;
    søkefilter: {
        alder: AlderState;
        arbeidserfaring: ArbeidserfaringState;
        forerkort: ForerkortState;
        fritekst: FritekstState;
        geografi: GeografiState;
        hovedmal: HovedmalState;
        innsatsgruppe: InnsatsgruppeState;
        kompetanse: KompetanseState;
        navkontor: NavkontorReducerState;
        permittering: PermitteringState;
        sprakReducer: SprakReducerState;
        stilling: StillingState;
        tilgjengelighet: TilgjengelighetState;
        tilretteleggingsbehov: TilretteleggingsbehovState;
        typeahead: TypeaheadState;
        utdanning: UtdanningState;
        prioriterteMålgrupper: PrioriterteMålgrupperState;
    };
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
    geografiListKomplett?: Geografi[];
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

export default AppState;
