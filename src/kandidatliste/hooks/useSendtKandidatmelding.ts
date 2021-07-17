import { useSelector } from 'react-redux';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import { Sms } from '../kandidatlistetyper';

const useSendtKandidatmelding = (fnr: string | null): Sms | undefined => {
    const { sendteMeldinger } = useSelector((state: AppState) => state.kandidatliste.sms);

    return sendteMeldinger.kind === Nettstatus.Suksess
        ? sendteMeldinger.data.find((sms) => sms.fnr === fnr)
        : undefined;
};

export default useSendtKandidatmelding;
