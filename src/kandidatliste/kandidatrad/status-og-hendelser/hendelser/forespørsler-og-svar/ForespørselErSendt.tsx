import { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../../utils/dateUtils';
import { ForespørselOmDelingAvCv } from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

type Props = {
    forespørselOmDelingAvCv: ForespørselOmDelingAvCv;
    erFørsteForespørsel: boolean;
};

const ForespørselErSendt: FunctionComponent<Props> = ({
    forespørselOmDelingAvCv,
    erFørsteForespørsel,
}) => {
    const { deltAv, deltTidspunkt } = forespørselOmDelingAvCv;

    const formatertDato = formaterDatoNaturlig(deltTidspunkt);
    const beskrivelse = `${formatertDato} av ${deltAv}`;

    const tittel = erFørsteForespørsel
        ? 'Stillingen er delt med kandidaten'
        : 'Stillingen er delt med kandidaten på nytt';

    return <Hendelse status={Hendelsesstatus.Grønn} tittel={tittel} beskrivelse={beskrivelse} />;
};

export default ForespørselErSendt;
