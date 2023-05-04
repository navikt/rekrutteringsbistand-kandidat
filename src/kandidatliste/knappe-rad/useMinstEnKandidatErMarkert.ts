import { useSelector } from 'react-redux';
import AppState from '../../state/AppState';

const useMinstEnKandidatErMarkert = (): boolean => {
    return Object.values(
        useSelector((state: AppState) => state.kandidatliste.kandidattilstander)
    ).some((tilstand) => tilstand?.markert);
};

export default useMinstEnKandidatErMarkert;
