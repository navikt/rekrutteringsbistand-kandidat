import { ListeoversiktState } from './kandidatlisteoversikt/reducer/listeoversiktReducer';
import { CvState } from './cv/reducer/cvReducer';
import { HistorikkState } from './historikk/historikkReducer';
import { KandidatlisteState } from './kandidatliste/reducer/kandidatlisteReducer';
import { NavKontorState } from './navKontor/navKontorReducer';
import { SearchState } from './kandidatsøk/reducer/searchReducer';
import { VarslingState } from './common/varsling/varslingReducer';
import { KandidatmatchState } from './automatisk-matching/kandidatmatchReducer';

type AppState = {
    cv: CvState;
    enhetsregister: any;
    historikk: HistorikkState;
    kandidatliste: KandidatlisteState;
    listeoversikt: ListeoversiktState;
    navKontor: NavKontorState;
    varsling: VarslingState;
    søk: SearchState;
    kandidatmatch: KandidatmatchState;
};

export default AppState;
