import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import './EndreUtfallModal.less';

interface Props {
    vis: boolean;
    utfall: Utfall;
    fornavn?: string;
    etternavn?: string;
    onBekreft?: () => void;
    onLukk: () => void;
}

const EndreUtfallModal: FunctionComponent<Props> = ({
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
            contentLabel="Endre utfall for kandidat"
            onRequestClose={onLukk}
            className="endreUtfallModal"
        >
            <Systemtittel className="endreUtfallModal__tittel">
                {utfallToDisplayName(utfall)}
            </Systemtittel>
            <div className="endreUtfallModal__beskrivelse">
                <Endringsbeskrivelse
                    utfall={utfall}
                    kandidatnavn={`${fornavn || ''} ${etternavn || ''}`}
                />
            </div>
            <Hovedknapp
                onClick={onBekreft ? onBekreft : () => {}}
                className="endreUtfallModal__bekreftknapp"
            >
                Fullfør
            </Hovedknapp>
            <Flatknapp onClick={onLukk}>Avbryt</Flatknapp>
        </NavFrontendModal>
    );
};

const Endringsbeskrivelse: FunctionComponent<{ utfall: Utfall; kandidatnavn: string }> = ({
    utfall,
    kandidatnavn,
}) => {
    if (utfall === Utfall.FåttJobben) {
        return (
            <>
                <Normaltekst>
                    Du registrerer nå at {kandidatnavn} har fått jobb. Formidlingen vil bli telt, og
                    tellingen vil bli brukt til statistikk.
                </Normaltekst>
                <Normaltekst>Ønsker du å fullføre registreringen?</Normaltekst>
            </>
        );
    }

    if (utfall === Utfall.Presentert) {
        return (
            <>
                <Normaltekst>
                    Du registrerer nå at {kandidatnavn} har blitt presentert for en arbeidsgiver.
                    Tellingen vil bli brukt til statistikk.
                </Normaltekst>
                <Normaltekst>Ønsker du å fullføre registreringen?</Normaltekst>
            </>
        );
    }

    return null;
};

export default EndreUtfallModal;
