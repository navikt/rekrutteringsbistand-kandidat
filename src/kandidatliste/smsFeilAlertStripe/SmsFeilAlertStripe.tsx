import React, { FunctionComponent, useState } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Lukknapp from 'nav-frontend-lukknapp';
import { Kandidat, Sms, SmsStatus } from '../kandidatlistetyper';
import './smsFeilAlertStripe.less';

const LESTE_SMS_IDER_KEY = 'lesteSmsIder';

type Props = {
    kandidater: Kandidat[];
    sendteMeldinger: Sms[];
};

const hentLesteSmsIder = () => {
    const lagredeIderJson = window.localStorage.getItem(LESTE_SMS_IDER_KEY);

    if (!lagredeIderJson) {
        return [];
    }

    const lagredeIder = JSON.parse(lagredeIderJson);
    if (!Array.isArray(lagredeIder)) {
        return [];
    }

    return lagredeIder;
};

const SmsFeilAlertStripe: FunctionComponent<Props> = ({ kandidater, sendteMeldinger }) => {
    const [lesteSmsIder, setLesteSmsIder] = useState<number[]>(hentLesteSmsIder());

    const kandidaterMedUlesteSmsFeil = kandidater.filter((kandidat) => {
        const sms = sendteMeldinger.find((sms) => sms.fnr === kandidat.fodselsnr);
        if (sms && sms.status === SmsStatus.Feil) {
            const erUlest = !lesteSmsIder.includes(sms.id);

            return erUlest;
        }

        return false;
    });

    const harLestAlleFeil = kandidaterMedUlesteSmsFeil.length === 0;
    if (harLestAlleFeil) return null;

    const lukkAlert = () => {
        const oppdatertLesteSmsIder = new Set<number>(lesteSmsIder);
        kandidaterMedUlesteSmsFeil
            .map((kandidat) => sendteMeldinger.find((sms) => sms.fnr === kandidat.fodselsnr)!.id)
            .forEach((id) => oppdatertLesteSmsIder.add(id));

        const oppdatertLesteSmsIderArray = Array.from(oppdatertLesteSmsIder);
        window.localStorage.setItem(LESTE_SMS_IDER_KEY, JSON.stringify(oppdatertLesteSmsIderArray));
        setLesteSmsIder(oppdatertLesteSmsIderArray);
    };

    const navn = kandidaterMedUlesteSmsFeil
        .map((kandidat) => `${kandidat.fornavn} ${kandidat.etternavn}`)
        .join(', ')
        .replace(/,(?=[^,]*$)/, ' og');

    return (
        <AlertStripeFeil className="smsFeilAlertStripe">
            SMS-en til {navn} ble dessverre ikke sendt. En mulig årsak kan være ugyldig
            telefonnummer i kontakt og reservasjonsregisteret.
            <Lukknapp className="smsFeilAlertStripe__lukknapp" onClick={lukkAlert} />
        </AlertStripeFeil>
    );
};

export default SmsFeilAlertStripe;
