import { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../../utils/dateUtils';
import {
    IdentType,
    SvarPåForespørsel,
} from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

type Props = {
    svar: SvarPåForespørsel;
};

const SvarFraKandidat: FunctionComponent<Props> = ({ svar, children }) => {
    const formatertTidspunkt = formaterDatoNaturlig(svar.svarTidspunkt);

    const beskrivelse = `${formatertTidspunkt} fra aktivitetsplanen, registrert av ${
        svar.svartAv.identType === IdentType.NavIdent ? svar.svartAv.ident : 'bruker'
    }`;

    return svar.harSvartJa ? (
        <Hendelse
            status={Hendelsesstatus.Grønn}
            tittel="Svar fra kandidat: Ja, del CV-en min"
            beskrivelse={beskrivelse}
        >
            {children}
        </Hendelse>
    ) : (
        <Hendelse
            status={Hendelsesstatus.Oransje}
            tittel="Svar fra kandidat: Nei, ikke del CV-en min"
            beskrivelse={beskrivelse}
        >
            {children}
        </Hendelse>
    );
};

export default SvarFraKandidat;
