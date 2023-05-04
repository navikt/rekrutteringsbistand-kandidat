import React, { FunctionComponent, useEffect, useState } from 'react';
import css from './NudgeAvsluttOppdragModal.module.css';
import Modal from '../../komponenter/modal/Modal';
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
        <Modal open={true} aria-label="Forslag om å avslutte oppdraget" onClose={onAvbryt}>
            <Heading spacing level="2" size="medium" className={css.tittel}>
                Ferdig med oppdraget?
            </Heading>
            <BodyShort spacing>
                {antallKandidaterSomHarFåttJobb} av {antallStillinger} stilling
                {antallStillinger === 1 ? '' : 'er'} er besatt
            </BodyShort>
            <BodyShort>Er du ferdig med oppdraget og vil avslutte?</BodyShort>
            <div className={css.knapper}>
                <Button onClick={onBekreft}>Avslutt oppdrag</Button>
                <Button variant="secondary" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </div>
        </Modal>
    );
};

export default NudgeAvsluttOppdragModal;
