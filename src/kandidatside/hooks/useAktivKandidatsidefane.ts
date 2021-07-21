import { useLocation } from 'react-router-dom';
import { Kandidatfane } from '../../app/paths';

const useAktivKandidatsidefane = () => {
    const { pathname } = useLocation();

    if (pathname.split('/').pop() === 'cv') {
        return Kandidatfane.Cv;
    } else {
        return Kandidatfane.Historikk;
    }
};

export default useAktivKandidatsidefane;
