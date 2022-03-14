import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const AlleredeLagtTil = () => (
    <AlertStripeFeil className="LeggTilKandidatModal__advarsel">
        <Element>Kandidaten er allerede lagt til i listen</Element>
        <Normaltekst>
            Finner du ikke kandidaten i kandidatlisten? Husk å sjekk om kandidaten er slettet ved å
            huke av "Vis kun slettede".
        </Normaltekst>
    </AlertStripeFeil>
);

export default AlleredeLagtTil;
