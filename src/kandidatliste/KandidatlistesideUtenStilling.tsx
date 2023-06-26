import { useParams } from 'react-router-dom';
import Kandidatlisteside from './Kandidatlisteside';

type Params = {
    listeid: string;
};

const KandidatlistesideUtenStilling = () => {
    const { listeid } = useParams<Params>();

    return <Kandidatlisteside kandidatlisteId={listeid} />;
};

export default KandidatlistesideUtenStilling;
