import React, { FunctionComponent, useState } from 'react';
import Popover from 'nav-frontend-popover';
import SendSmsIkon from './SendSmsIkon';
import { Sms, SmsStatus } from '../../kandidatlistetyper';
import { PopoverOrientering } from 'nav-frontend-popover';
import './SmsStatusPopup.less';
import HjelpetekstMedAnker from '../../../../felles/common/hjelpetekst-med-anker/HjelpetekstMedAnker';

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
        <HjelpetekstMedAnker
            className="sms-status-popup"
            innhold={<Popuptekst sms={sms} />}
            orientering={PopoverOrientering.Under}
        >
            <SendSmsIkon feil={sms.status === SmsStatus.Feil} />
        </HjelpetekstMedAnker>
    );
};

export default SmsStatusIkon;
