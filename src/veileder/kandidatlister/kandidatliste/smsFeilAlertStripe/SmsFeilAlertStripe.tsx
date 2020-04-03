import React, { FunctionComponent } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { KandidatIKandidatliste, SmsStatus } from '../../kandidatlistetyper';

type Props = {
    kandidater: KandidatIKandidatliste[];
};

const SmsFeilAlertStripe: FunctionComponent<Props> = ({ kandidater }) => {
    const navn = kandidater
        .filter(kandidat => kandidat.sms && kandidat.sms.status === SmsStatus.Feil)
        .map(kandidat => `${kandidat.fornavn} ${kandidat.etternavn}`)
        .join(', ')
        .replace(/,(?=[^,]*$)/, ' og');

    return (
        <AlertStripeFeil>
            SMS-en til {navn} ble dessverre ikke sendt. En mulig årsak kan være ugyldig
            telefonnummer i kontakt og reservasjonsregisteret.
        </AlertStripeFeil>
    );
};

export default SmsFeilAlertStripe;
