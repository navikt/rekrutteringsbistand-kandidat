import React, { FunctionComponent } from 'react';
import { HjelpetekstUnder } from 'nav-frontend-hjelpetekst';
import SendSmsIkon from './SendSmsIkon';
import { Sms, SmsStatus } from '../../../kandidatlistetyper';

const formaterSendtDato = (dato: Date) => {
    return `${dato.toLocaleString('no-NB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })}`;
};

type Props = {
    sms: Sms;
};

const SmsStatusIkon: FunctionComponent<Props> = ({ sms }) => {
    if (sms.status === SmsStatus.IkkeSendt) return null;

    const popupTekst =
        sms.status === SmsStatus.Feil
            ? 'SMS-en ble dessverre ikke sendt. ' +
              'En mulig årsak kan være ugyldig telefonnummer i Kontakt- og reservasjonsregisteret.'
            : 'En SMS blir sendt til kandidaten.';

    const ikon = () => <SendSmsIkon feil={sms.status === SmsStatus.Feil} />;

    // TODO flytte classname inn i denne pakken
    return (
        <HjelpetekstUnder className="sms-status-popup" id="hjelpetekst-sms-status" anchor={ikon}>
            {formaterSendtDato(new Date(sms.opprettet))}
            <br />
            {popupTekst}
        </HjelpetekstUnder>
    );
};

export default SmsStatusIkon;
