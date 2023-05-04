import { useSelector } from 'react-redux';
import AppState from '../../state/AppState';

const useKandidatnotater = (kandidatnr: string) => {
    const { kandidatnotater } = useSelector((state: AppState) => state.kandidatliste);

    return kandidatnotater[kandidatnr];
};

export default useKandidatnotater;
