import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';

interface Props {
    vis: boolean;
    kandidat: KandidatIKandidatliste;
    utfall: Utfall;
    onBekreft: () => void;
    onLukk: () => void;
}

const EndreUtfallModal: FunctionComponent<Props> = ({
    vis,
    kandidat,
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
        >
            <Systemtittel>{utfallToDisplayName(utfall)}</Systemtittel>
            <Normaltekst>
                <Endringsbeskrivelse
                    utfall={utfall}
                    kandidatnavn={`${kandidat.fornavn} ${kandidat.etternavn}`}
                />
            </Normaltekst>
            <Hovedknapp onClick={onBekreft}>Fullfør</Hovedknapp>
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
                <Normaltekst>Ønsker du å fullføre formidlingen?</Normaltekst>
            </>
        );
    }

    if (utfall === Utfall.Presentert) {
        return (
            <>
                <Normaltekst>
                    Du registrerer nå at {kandidatnavn} har blitt presentert for en arbeidsgiver.
                    Formidlingen vil bli telt, og tellingen vil bli brukt til statistikk.
                </Normaltekst>
                <Normaltekst>Ønsker du å fullføre formidlingen?</Normaltekst>
            </>
        );
    }

    return null;
};

export default EndreUtfallModal;
