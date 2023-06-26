import { useParams } from 'react-router-dom';
import Kandidatlisteside from './Kandidatlisteside';

type Params = {
    id: string;
};

const KandidatlistesideMedStilling = () => {
    const { id } = useParams<Params>();

    return <Kandidatlisteside stillingsId={id} />;
};

export default KandidatlistesideMedStilling;
