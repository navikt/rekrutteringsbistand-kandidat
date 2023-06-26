import { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { Sms, SmsStatus } from '../../../domene/Kandidatressurser';

type Props = {
    sms?: Sms;
};

const SmsSendt: FunctionComponent<Props> = ({ sms }) => {
    function smstekst(smsMelding) {
        return `${formaterDatoNaturlig(smsMelding.opprettet)} av ${smsMelding.navIdent}`;
    }

    if (!sms) {
        return null;
    }

    switch (sms.status) {
        case SmsStatus.Feil:
            return (
                <Hendelse
                    status={Hendelsesstatus.Rød}
                    tittel="SMS-en ble ikke sendt"
                    beskrivelse={smstekst(sms)}
                />
            );
        case SmsStatus.Sendt:
            return (
                <Hendelse
                    status={Hendelsesstatus.Grønn}
                    tittel="SMS er sendt til kandidaten"
                    beskrivelse={smstekst(sms)}
                />
            );
    }
    return null;
};

export default SmsSendt;
