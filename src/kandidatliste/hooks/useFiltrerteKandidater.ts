import { useSelector } from 'react-redux';
import AppState from '../../state/AppState';
import { Kandidat } from '../domene/Kandidat';

const useFiltrerteKandidater = (kandidater: Kandidat[]) => {
    const { kandidattilstander } = useSelector((state: AppState) => state.kandidatliste);

    const filtrerteKandidater = kandidater.filter(
        (kandidat) => !kandidattilstander[kandidat.kandidatnr]?.filtrertBort
    );

    return filtrerteKandidater;
};

export default useFiltrerteKandidater;
