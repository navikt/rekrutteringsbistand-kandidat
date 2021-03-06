import React, { FunctionComponent, useState } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { KandidatIKandidatliste, SmsStatus } from '../kandidatlistetyper';
import './smsFeilAlertStripe.less';
import Lukknapp from 'nav-frontend-lukknapp';

const LESTE_SMS_IDER_KEY = 'lesteSmsIder';

type Props = {
    kandidater: KandidatIKandidatliste[];
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

const SmsFeilAlertStripe: FunctionComponent<Props> = ({ kandidater }) => {
    const [lesteSmsIder, setLesteSmsIder] = useState<number[]>(hentLesteSmsIder());

    const kandidaterMedUlesteSmsFeil = kandidater
        .filter((kandidat) => kandidat.sms && kandidat.sms.status === SmsStatus.Feil)
        .filter((kandidat) => !lesteSmsIder.includes(kandidat.sms!.id));

    const harLestAlleFeil = kandidaterMedUlesteSmsFeil.length === 0;
    if (harLestAlleFeil) return null;

    const lukkAlert = () => {
        const oppdatertLesteSmsIder = new Set<number>(lesteSmsIder);
        kandidaterMedUlesteSmsFeil
            .map((kandidat) => kandidat.sms!.id)
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
