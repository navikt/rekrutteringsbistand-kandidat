import { ListeoversiktState } from '../kandidatlisteoversikt/reducer/listeoversiktReducer';
import { CvState } from '../cv/reducer/cvReducer';
import { HistorikkState } from '../historikk/historikkReducer';
import { KandidatlisteState } from '../kandidatliste/reducer/kandidatlisteReducer';
import { NavKontorState } from './navKontorReducer';
import { ErrorState } from './errorReducer';
import { VarslingState } from '../varsling/varslingReducer';

type AppState = {
    cv: CvState;
    enhetsregister: any;
    historikk: HistorikkState;
    kandidatliste: KandidatlisteState;
    listeoversikt: ListeoversiktState;
    navKontor: NavKontorState;
    varsling: VarslingState;
    error: ErrorState;
};

export default AppState;
