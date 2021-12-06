import React, { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { Sms, SmsStatus } from '../../../domene/Kandidatressurser';

type Props = {
    sms?: Sms;
};

const SmsSendt: FunctionComponent<Props> = ({ sms }) => {
    function smstekst(smsMelding) {
        return `${formaterDatoNaturlig(smsMelding.opprettet)} av ${smsMelding.id}`;
    }
    console.log('sms', sms);

    if (sms) {
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
                        tittel="Ny kandidat"
                        beskrivelse={smstekst(sms)}
                    />
                );
        }
        return <div></div>;
    }
    return <div></div>;
};

export default SmsSendt;
