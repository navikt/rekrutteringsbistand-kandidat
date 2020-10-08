import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import './NudgeAvsluttOppdragModal.less';

interface Props {
    vis: boolean;
    utfall: Utfall;
    fornavn?: string;
    etternavn?: string;
    onBekreft?: () => void;
    onLukk: () => void;
}

const NudgeAvsluttOppdragModal: FunctionComponent<Props> = ({
    vis,
    fornavn,
    etternavn,
    utfall,
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
                <NudgeAvsluttOppdragBeskrivelse
                    antallBesatt={666}
                    totaltAntall={666}
                />
            </div>
            <Hovedknapp
                onClick={onBekreft ? onBekreft : () => {}}
                className="nudgeAvsluttOppdragModal__bekreftknapp"
            >
                Fullfør
            </Hovedknapp>
            <Flatknapp onClick={onLukk}>Avbryt</Flatknapp>
        </NavFrontendModal>
    );
};

const NudgeAvsluttOppdragBeskrivelse: FunctionComponent<{ antallBesatt: int; totaltAntall: int }> = ({
    antallBesatt ,
    totaltAntall
}) => {
        return (
            <>
                <Normaltekst>
                    Du registrerer nå at Draugen har fått jobb. Formidlingen vil bli telt, og
                    tellingen vil bli brukt til statistikk.
                </Normaltekst>
                <Normaltekst>Ønsker du å fullføre registreringen?</Normaltekst>
            </>
        );
    }


export default NudgeAvsluttOppdragModal;
