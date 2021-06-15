import React, { FunctionComponent } from 'react';
import { Flatknapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';

type Props = {
    utfall: Utfall;
};

const RegistrerEllerFjernFåttJobben: FunctionComponent<Props> = ({ utfall }) => {
    return utfall === Utfall.FåttJobben ? (
        <Flatknapp
            mini
            kompakt
            className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
        >
            <MinusCircle />
            Fjern registrering
        </Flatknapp>
    ) : (
        <Flatknapp
            mini
            kompakt
            className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
        >
            <AddCircle />
            Registrer at kandidaten har fått jobb
        </Flatknapp>
    );
};

export default RegistrerEllerFjernFåttJobben;
