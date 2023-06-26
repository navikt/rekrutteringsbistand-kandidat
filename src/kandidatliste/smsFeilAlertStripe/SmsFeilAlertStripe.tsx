import { FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import { Alert, Button } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Kandidatmeldinger, SmsStatus } from '../domene/Kandidatressurser';
import { Kandidat } from '../domene/Kandidat';
import css from './smsFeilAlertStripe.module.css';

const LESTE_SMS_IDER_KEY = 'lesteSmsIder';

type Props = {
    kandidater: Kandidat[];
    sendteMeldinger: Kandidatmeldinger;
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
        if (!kandidat.fodselsnr) {
            return false;
        }

        const sms = sendteMeldinger[kandidat.fodselsnr];
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
            .filter((kandidat) => kandidat.fodselsnr)
            .map((kandidat) => sendteMeldinger[kandidat.fodselsnr!].id)
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
        <Alert variant="error" className={classNames(css.alert, 'sms-ikke-sendt-alert')}>
            <span className={css.alertstripeBody}>
                SMS-en til {navn} ble dessverre ikke sendt. En mulig årsak kan være ugyldig
                telefonnummer i kontakt og reservasjonsregisteret.
                <Button
                    size="small"
                    variant="secondary-neutral"
                    icon={<XMarkIcon />}
                    className={css.lukknapp}
                    onClick={lukkAlert}
                />
            </span>
        </Alert>
    );
};

export default SmsFeilAlertStripe;
