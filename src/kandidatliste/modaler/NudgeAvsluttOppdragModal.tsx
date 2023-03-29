import React, { FunctionComponent, useEffect, useState } from 'react';
import css from './NudgeAvsluttOppdragModal.module.css';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { BodyShort, Heading, Button } from '@navikt/ds-react';

interface Props {
    antallKandidaterSomHarFåttJobb: number;
    antallStillinger: number;
    onBekreft: () => void;
    onAvbryt: () => void;
}

const NudgeAvsluttOppdragModal: FunctionComponent<Props> = ({
    antallKandidaterSomHarFåttJobb,
    antallStillinger,
    onBekreft,
    onAvbryt,
}) => {
    const [klar, setKlar] = useState<Boolean>(false);

    useEffect(() => {
        const klarTimeout = setTimeout(() => {
            setKlar(true);
        }, 400);

        return () => {
            clearTimeout(klarTimeout);
        };
    }, []);

    if (!klar) {
        return null;
    }

    return (
        <ModalMedKandidatScope
            open={true}
            aria-label="Forslag om å avslutte oppdraget"
            onClose={onAvbryt}
        >
            <Heading level="3" size="medium" className={css.tittel}>
                Ferdig med oppdraget?
            </Heading>

            <div className={css.beskrivelse}>
                <BodyShort spacing>
                    {antallKandidaterSomHarFåttJobb} av {antallStillinger} stilling
                    {antallStillinger === 1 ? '' : 'er'} er besatt
                </BodyShort>
                <BodyShort spacing>Er du ferdig med oppdraget og vil avslutte?</BodyShort>
            </div>
            <div className={css.knapper}>
                <Button onClick={onBekreft} className={css.bekreftknapp}>
                    Ja, Avslutt
                </Button>
                <Button variant="secondary" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </div>
        </ModalMedKandidatScope>
    );
};

export default NudgeAvsluttOppdragModal;
