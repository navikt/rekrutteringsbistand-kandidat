import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { finnesIkke, Nettstatus, feil, lasterInn, suksess } from '../../api/Nettressurs';
import { Kandidat } from '../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';

const useForespørselOmDelingAvCv = (kandidat: Kandidat, kandidatliste: Kandidatliste) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const stillingsId = kandidatliste.stillingId;

    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    useEffect(() => {
        if (stillingsId) {
            dispatch({
                type: KandidatlisteActionType.NullstillForespørslerOmDelingAvCv,
            });

            dispatch({
                type: KandidatlisteActionType.HentForespørslerOmDelingAvCv,
                stillingsId,
            });
        }
    }, [dispatch, stillingsId]);

    if (kandidat.aktørid === null) {
        return finnesIkke();
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.Feil) {
        return feil(forespørslerOmDelingAvCv.error);
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.LasterInn) {
        return lasterInn();
    }

    if (forespørslerOmDelingAvCv.kind === Nettstatus.Suksess) {
        const forespørsel = forespørslerOmDelingAvCv[kandidat.aktørid];

        if (forespørsel) {
            return suksess(forespørsel);
        } else {
            return finnesIkke();
        }
    }

    return forespørslerOmDelingAvCv;
};

export default useForespørselOmDelingAvCv;
