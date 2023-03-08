import React, { FunctionComponent, useEffect, useState } from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import './NudgeAvsluttOppdragModal.less';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';

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
                <Systemtittel className="nudgeAvsluttOppdragModal__tittel">
                    Ferdig med oppdraget?
                </Systemtittel>
                <div className="nudgeAvsluttOppdragModal__beskrivelse">
                    <Normaltekst>
                        {antallKandidaterSomHarFåttJobb} av {antallStillinger} stilling
                        {antallStillinger === 1 ? '' : 'er'} er besatt
                    </Normaltekst>
                    <Normaltekst>Er du ferdig med oppdraget og vil avslutte?</Normaltekst>
                </div>
                <Hovedknapp onClick={onBekreft} className="nudgeAvsluttOppdragModal__bekreftknapp">
                    Ja, Avslutt
                </Hovedknapp>
                <Flatknapp onClick={onAvbryt}>Avbryt</Flatknapp>
            </ModalMedKandidatScope>
        )
    );
};

export default NudgeAvsluttOppdragModal;
