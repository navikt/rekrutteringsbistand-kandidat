import React, { FunctionComponent, useEffect, useState } from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import './NudgeAvsluttOppdragModal.less';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { BodyShort, Label, Heading, Button } from '@navikt/ds-react';

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
    return (
        klar && (
            <ModalMedKandidatScope
                open={true}
                aria-label="Forslag om å avslutte oppdraget"
                onClose={onAvbryt}
                className="nudgeAvsluttOppdragModal"
            >
                <Heading level="3" size="medium" className="nudgeAvsluttOppdragModal__tittel">
                    Ferdig med oppdraget?
                </Heading>

                <div className="nudgeAvsluttOppdragModal__beskrivelse">
                    <BodyShort spacing>
                        {antallKandidaterSomHarFåttJobb} av {antallStillinger} stilling
                        {antallStillinger === 1 ? '' : 'er'} er besatt
                    </BodyShort>
                    <BodyShort spacing>Er du ferdig med oppdraget og vil avslutte?</BodyShort>
                </div>
                <Button onClick={onBekreft} className="nudgeAvsluttOppdragModal__bekreftknapp">
                    Ja, Avslutt
                </Button>
                <Button variant="secondary" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </ModalMedKandidatScope>
        )
    );
};

export default NudgeAvsluttOppdragModal;
