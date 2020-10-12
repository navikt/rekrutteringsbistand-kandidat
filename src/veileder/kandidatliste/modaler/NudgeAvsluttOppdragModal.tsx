import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import './NudgeAvsluttOppdragModal.less';

interface Props {
    antallKandidaterSomHarFåttJobb: number;
    antallStillinger: number;
    onBekreft?: () => void;
    onAvbryt: () => void;
}

const NudgeAvsluttOppdragModal: FunctionComponent<Props> = ({
    antallKandidaterSomHarFåttJobb,
    antallStillinger,
    onBekreft,
    onAvbryt,
}) => {
    return (
        <NavFrontendModal
            closeButton
            isOpen={true}
            contentLabel="Foreslå å avslutte oppdraget (lukke kandidatlisten)"
            onRequestClose={onAvbryt}
            className="nudgeAvsluttOppdragModal"
        >
            <Systemtittel className="nudgeAvsluttOppdragModal__tittel">
                Ferdig med oppdraget?
            </Systemtittel>
            <div className="nudgeAvsluttOppdragModal__beskrivelse">
                <Normaltekst>
                    {antallKandidaterSomHarFåttJobb} av {antallStillinger} er besatt
                </Normaltekst>
                <Normaltekst>Er du ferdig med oppdraget og vil avslutte?</Normaltekst>
            </div>
            <Hovedknapp onClick={onBekreft} className="nudgeAvsluttOppdragModal__bekreftknapp">
                Ja, Avslutt
            </Hovedknapp>
            <Flatknapp onClick={onAvbryt}>Avbryt</Flatknapp>
        </NavFrontendModal>
    );
};

export default NudgeAvsluttOppdragModal;
