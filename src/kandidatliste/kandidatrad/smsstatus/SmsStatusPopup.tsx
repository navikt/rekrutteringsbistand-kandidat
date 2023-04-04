import React, { FunctionComponent } from 'react';
import SendSmsIkon from './SendSmsIkon';
import { Sms, SmsStatus } from '../../domene/Kandidatressurser';
import MedPopover from '../../../common/med-popover/MedPopover';
import './SmsStatusPopup.less';

const formaterSendtDato = (dato: Date) => {
    return `${dato.toLocaleString('nb-NO', {
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

const Popuptekst: FunctionComponent<{ sms: Sms }> = ({ sms }) => {
    const popupTekst =
        sms.status === SmsStatus.Feil
            ? 'SMS-en ble dessverre ikke sendt. ' +
              'En mulig årsak kan være ugyldig telefonnummer i Kontakt- og reservasjonsregisteret.'
            : 'En SMS blir sendt til kandidaten.';

    return (
        <>
            {formaterSendtDato(new Date(sms.opprettet))}
            <br />
            {popupTekst}
        </>
    );
};

const SmsStatusIkon: FunctionComponent<Props> = ({ sms }) => {
    if (sms.status === SmsStatus.IkkeSendt) return null;

    return (
        <MedPopover className="sms-status-popup" hjelpetekst={<Popuptekst sms={sms} />}>
            <SendSmsIkon feil={sms.status === SmsStatus.Feil} />
        </MedPopover>
    );
};

export default SmsStatusIkon;
