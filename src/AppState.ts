import { ListeoversiktState } from './kandidatlisteoversikt/reducer/listeoversiktReducer';
import { CvState } from './cv/reducer/cvReducer';
import { HistorikkState } from './historikk/historikkReducer';
import { KandidatlisteState } from './kandidatliste/reducer/kandidatlisteReducer';
import { NavKontorState } from './navKontor/navKontorReducer';
import { SearchState } from './kandidatsøk/reducer/searchReducer';
import { VarslingState } from './varsling/varslingReducer';

type AppState = {
    cv: CvState;
    enhetsregister: any;
    historikk: HistorikkState;
    kandidatliste: KandidatlisteState;
    listeoversikt: ListeoversiktState;
    navKontor: NavKontorState;
    varsling: VarslingState;
    søk: SearchState;
};

export default AppState;
