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

    // TODO Følgende burde defineres i sine respektive reducere
    fritekst: { fritekst?: string };
    stilling: { stillinger?: string[] };
    kompetanse: { kompetanser?: string[] };
    utdanning: {
        utdanninger?: string[];
        utdanningsniva?: string[];
    };
    geografi: { geografiList?: string[]; maaBoInnenforGeografi?: boolean };
    sprakReducer: { sprak?: string[] };
    forerkort: { forerkortList?: string[] };
    innsatsgruppe: { kvalifiseringsgruppeKoder?: string[] };
    navkontorReducer: { navkontor: string[]; minekandidater?: boolean };
    hovedmal: { totaltHovedmal: string[] };
    tilretteleggingsbehov: {
        harTilretteleggingsbehov?: boolean;
        kategorier?: string[];
    }
};

export default AppState;
