import { useSelector } from 'react-redux';
import AppState from '../../AppState';

const useMidlertidigUtilgjengelig = (kandidatnr: string) => {
    const state = useSelector((state: AppState) => state.midlertidigUtilgjengelig);

    return state[kandidatnr];
};

export default useMidlertidigUtilgjengelig;
