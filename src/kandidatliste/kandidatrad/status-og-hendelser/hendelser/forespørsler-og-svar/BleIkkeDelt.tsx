import { FunctionComponent, ReactNode } from 'react';
import { formaterDatoNaturlig } from '../../../../../utils/dateUtils';
import { ForespørselOmDelingAvCv } from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

type Props = {
    forespørsel: ForespørselOmDelingAvCv;
    children: ReactNode;
};

const BleIkkeDelt: FunctionComponent<Props> = ({ forespørsel, children }) => {
    return (
        <Hendelse
            status={Hendelsesstatus.Rød}
            tittel="Stillingen ble ikke delt"
            beskrivelse={`${formaterDatoNaturlig(forespørsel.deltTidspunkt)} av ${
                forespørsel.deltAv
            }`}
        >
            {children}
        </Hendelse>
    );
};

export default BleIkkeDelt;
