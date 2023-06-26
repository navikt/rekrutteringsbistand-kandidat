import { FunctionComponent } from 'react';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

const ForespørselErIkkeSendt: FunctionComponent = () => {
    return (
        <Hendelse
            status={Hendelsesstatus.Hvit}
            tittel="Svar fra kandidat om deling av CV"
            beskrivelse="Hentes automatisk fra aktivitetsplanen"
        />
    );
};

export default ForespørselErIkkeSendt;
