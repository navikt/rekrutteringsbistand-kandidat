import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../state/AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { Nettstatus } from '../../api/Nettressurs';
import { Kandidat } from '../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';

const useSendtKandidatmelding = (kandidat: Kandidat, kandidatliste: Kandidatliste) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();

    const { sendteMeldinger } = useSelector((state: AppState) => state.kandidatliste.sms);

    useEffect(() => {
        dispatch({
            type: KandidatlisteActionType.HentSendteMeldinger,
            kandidatlisteId: kandidatliste.kandidatlisteId,
        });
    }, [dispatch, kandidatliste.kandidatlisteId]);

    if (sendteMeldinger.kind !== Nettstatus.Suksess || kandidat.fodselsnr === null) {
        return undefined;
    } else {
        return sendteMeldinger.data[kandidat.fodselsnr];
    }
};

export default useSendtKandidatmelding;
