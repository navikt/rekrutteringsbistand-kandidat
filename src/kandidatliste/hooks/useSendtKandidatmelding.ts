import { useSelector } from 'react-redux';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import { Fødselsnummer, Sms } from '../kandidatlistetyper';

const useSendtKandidatmelding = (kandidatensFnr: Fødselsnummer | null): Sms | undefined => {
    const { sendteMeldinger } = useSelector((state: AppState) => state.kandidatliste.sms);

    return sendteMeldinger.kind === Nettstatus.Suksess && kandidatensFnr
        ? sendteMeldinger.data[kandidatensFnr]
        : undefined;
};

export default useSendtKandidatmelding;
