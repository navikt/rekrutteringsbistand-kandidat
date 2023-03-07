import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Kandidatfane } from '../../app/paths';

const useFaner = (): [Kandidatfane, (nyFane: Kandidatfane) => void] => {
    const { search, pathname } = useLocation();
    const { kandidatnr } = useParams();
    const navigate = useNavigate();

    let fane = Kandidatfane.Cv;
    if (pathname.split('/').pop() === 'historikk') {
        fane = Kandidatfane.Historikk;
    }

    const setFane = (nyFane: Kandidatfane) => {
        const fullPath = `/kandidater/kandidat/${kandidatnr}/${nyFane}${search}`;
        navigate(fullPath);
    };

    return [fane, setFane];
};

export default useFaner;
