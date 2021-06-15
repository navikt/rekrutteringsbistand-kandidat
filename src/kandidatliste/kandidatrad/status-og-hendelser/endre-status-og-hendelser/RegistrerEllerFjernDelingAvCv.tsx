import React, { FunctionComponent } from 'react';
import { Flatknapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';

type Props = {
    utfall: Utfall;
};

const RegistrerEllerFjernDelingAvCv: FunctionComponent<Props> = ({ utfall }) => {
    return utfall === Utfall.IkkePresentert ? (
        <Flatknapp className="endre-status-og-hendelser__registrer-hendelse" kompakt mini>
            <AddCircle />
            Registrer manuelt
        </Flatknapp>
    ) : (
        <Flatknapp className="endre-status-og-hendelser__registrer-hendelse" kompakt mini>
            <MinusCircle />
            Fjern registrering
        </Flatknapp>
    );
};

export default RegistrerEllerFjernDelingAvCv;
