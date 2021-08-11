import React, { FunctionComponent } from 'react';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import { ForespørselOmDelingAvCv } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse from './Hendelse';

type Props = {
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
};

const DelStillingMedKandidat: FunctionComponent<Props> = ({ forespørselOmDelingAvCv }) => {
    const tittel = 'Stillingen er delt med kandidaten';

    if (forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) {
        return <Hendelse checked={false} tittel={tittel} beskrivelse="Deles fra kandidatlisten" />;
    }

    if (forespørselOmDelingAvCv.kind === Nettstatus.Suksess) {
        const { deltAv, deltTidspunkt } = forespørselOmDelingAvCv.data;
        const formatertTidspunkt = datoformatNorskLang(deltTidspunkt);
        const beskrivelse = `${formatertTidspunkt} av ${deltAv}`;

        return <Hendelse checked={true} tittel={tittel} beskrivelse={beskrivelse} />;
    }

    return null;
};

export default DelStillingMedKandidat;
