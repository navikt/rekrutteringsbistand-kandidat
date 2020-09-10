import { useDispatch } from 'react-redux';
import { Sms } from '../kandidatlistetyper';
import { useEffect } from 'react';
import { RemoteData, Nettstatus } from '../../../felles/common/remoteData';
import { Kandidatliste } from '../kandidatlistetyper';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';

const useHentSendteMeldinger = (
    kandidatliste: RemoteData<Kandidatliste>,
    kandidatmeldinger: RemoteData<Sms[]>
) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (
            kandidatliste.kind === Nettstatus.Suksess &&
            kandidatmeldinger.kind === Nettstatus.IkkeLastet
        ) {
            dispatch({
                type: KandidatlisteActionType.HENT_SENDTE_MELDINGER,
                kandidatlisteId: kandidatliste.data.kandidatlisteId,
            });
        }
    }, [dispatch, kandidatliste, kandidatmeldinger]);
};

export default useHentSendteMeldinger;
