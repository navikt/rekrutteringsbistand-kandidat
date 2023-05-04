import { useSelector } from 'react-redux';
import AppState from '../../state/AppState';
import {
    feil,
    finnesIkke,
    ikkeLastet,
    lasterInn,
    Nettressurs,
    Nettstatus,
    suksess,
} from '../../api/Nettressurs';
import {
    ForespørslerForKandidatForStilling,
    hentForespørslerForKandidatForStilling,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

const useForespørselOmDelingAvCv = (
    aktørId: string | null
): Nettressurs<ForespørslerForKandidatForStilling> => {
    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    if (aktørId === null) {
        return finnesIkke();
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.Suksess) {
        const forespørselForKandidat = hentForespørslerForKandidatForStilling(
            aktørId,
            forespørslerOmDelingAvCv.data
        );

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
