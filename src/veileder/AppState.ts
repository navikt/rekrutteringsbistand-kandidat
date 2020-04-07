import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';
import { PermitteringState } from './sok/permittering/permitteringReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    permittering: PermitteringState;
    search: any;
};

export default AppState;
