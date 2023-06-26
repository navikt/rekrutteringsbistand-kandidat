import { FunctionComponent } from 'react';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

const IkkeDeltMedKandidat: FunctionComponent = () => {
    return (
        <Hendelse
            status={Hendelsesstatus.Hvit}
            tittel="Stillingen er delt med kandidaten"
            beskrivelse="Deles fra kandidatlisten"
        />
    );
};

export default IkkeDeltMedKandidat;
