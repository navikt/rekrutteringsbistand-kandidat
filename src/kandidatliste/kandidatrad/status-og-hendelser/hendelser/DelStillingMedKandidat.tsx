import React, { FunctionComponent } from 'react';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { ForespørselOmDelingAvCv } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from './Hendelse';

type Props = {
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
};

const DelStillingMedKandidat: FunctionComponent<Props> = ({ forespørselOmDelingAvCv }) => {
    const tittel = 'Stillingen er delt med kandidaten';

    if (forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) {
        return (
            <Hendelse
                status={Hendelsesstatus.Hvit}
                tittel={tittel}
                beskrivelse="Deles fra kandidatlisten"
            />
        );
    }

    if (forespørselOmDelingAvCv.kind === Nettstatus.Suksess) {
        const { deltAv, deltTidspunkt } = forespørselOmDelingAvCv.data;
        const formatertDato = formaterDatoNaturlig(deltTidspunkt);
        const beskrivelse = `${formatertDato} av ${deltAv}`;

        return (
            <Hendelse status={Hendelsesstatus.Grønn} tittel={tittel} beskrivelse={beskrivelse} />
        );
    }

    return null;
};

export default DelStillingMedKandidat;
