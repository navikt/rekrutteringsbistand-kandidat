import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import './NudgeAvsluttOppdragModal.less';

interface Props {
    vis: boolean;
    antallKandidaterSomHarFåttJobb: Number;
    antallStillinger: Number;
    utfall: Utfall;
    fornavn?: string;
    etternavn?: string;
    onBekreft?: () => void;
    onLukk: () => void;
}

const NudgeAvsluttOppdragModal: FunctionComponent<Props> = ({
    vis,
    antallKandidaterSomHarFåttJobb,
    antallStillinger,
    onBekreft,
    onLukk,
}) => {
    return (
        <NavFrontendModal
            closeButton
            isOpen={vis}
            contentLabel="Foreslå å avslutte oppdraget (lukke kandidatlisten)"
            onRequestClose={onLukk}
            className="nudgeAvsluttOppdragModal"
        >
            <Systemtittel className="nudgeAvsluttOppdragModal__tittel">Ferdig med oppdraget?</Systemtittel>
            <div className="nudgeAvsluttOppdragModal__beskrivelse">
            <Normaltekst>
                    {antallKandidaterSomHarFåttJobb} av {antallStillinger} er besatt
                </Normaltekst>
                <Normaltekst>Er du ferdig med oppdraget og vil avslutte?</Normaltekst>
            </div>
            <Hovedknapp
                onClick={onBekreft ? onBekreft : () => {}}
                className="nudgeAvsluttOppdragModal__bekreftknapp"
            >
                Ja, Avslutt
            </Hovedknapp>
            <Flatknapp onClick={onLukk}>Avbryt</Flatknapp>
        </NavFrontendModal>
    );
};

export default NudgeAvsluttOppdragModal;
