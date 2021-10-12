import { useSelector } from 'react-redux';
import AppState from '../../AppState';
import {
    feil,
    finnesIkke,
    ikkeLastet,
    lasterInn,
    Nettressurs,
    Nettstatus,
    suksess,
} from '../../api/Nettressurs';
import { ForespørselOmDelingAvCv } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

const useForespørselOmDelingAvCv = (
    aktørId: string | null
): Nettressurs<ForespørselOmDelingAvCv> => {
    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    if (aktørId === null) {
        return finnesIkke();
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.Suksess) {
        const forespørselForKandidat = forespørslerOmDelingAvCv.data[aktørId]?.gjeldendeForespørsel;

        if (forespørselForKandidat) {
            return suksess(forespørselForKandidat);
        } else {
            return finnesIkke();
        }
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.Feil) {
        return feil(forespørslerOmDelingAvCv.error);
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.LasterInn) {
        return lasterInn();
    }

    return ikkeLastet();
};

export default useForespørselOmDelingAvCv;
