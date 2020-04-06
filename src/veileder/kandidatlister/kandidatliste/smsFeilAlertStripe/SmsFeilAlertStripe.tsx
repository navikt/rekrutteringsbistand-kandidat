import React, { FunctionComponent, useState } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { KandidatIKandidatliste, SmsStatus } from '../../kandidatlistetyper';
import './ssmsFeilAlertStripe.less';
import Lukknapp from 'nav-frontend-lukknapp';

const LESTE_KANDIDATLISTE_IDER_KEY = 'lesteKandidatlisteIder';

type Props = {
    kandidatlisteId: string;
    kandidater: KandidatIKandidatliste[];
};

const lesteKandidatlisteIder: string[] = window.localStorage.getItem(LESTE_KANDIDATLISTE_IDER_KEY)
    ? JSON.parse(window.localStorage.getItem(LESTE_KANDIDATLISTE_IDER_KEY)!)
    : [];

const SmsFeilAlertStripe: FunctionComponent<Props> = ({ kandidatlisteId, kandidater }) => {
    const [harLukketAlerten, setHarLukketAlerten] = useState<boolean>(
        lesteKandidatlisteIder.includes(kandidatlisteId)
    );

    if (harLukketAlerten) return null;

    const lukkAlert = () => {
        if (!harLukketAlerten) {
            const lesteKandidatlisteIderMedDenneListen = [
                ...lesteKandidatlisteIder,
                kandidatlisteId,
            ];
            window.localStorage.setItem(
                LESTE_KANDIDATLISTE_IDER_KEY,
                JSON.stringify(lesteKandidatlisteIderMedDenneListen)
            );
            setHarLukketAlerten(true);
        }
    };

    const navn = kandidater
        .filter(kandidat => kandidat.sms && kandidat.sms.status === SmsStatus.Feil)
        .map(kandidat => `${kandidat.fornavn} ${kandidat.etternavn}`)
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
