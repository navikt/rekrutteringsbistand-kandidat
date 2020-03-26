import { KandidatlisteState } from './kandidatlister/reducer/kandidatlisteReducer';

type AppState = {
    kandidatlister: KandidatlisteState;
    search: any;
};

export default AppState;
