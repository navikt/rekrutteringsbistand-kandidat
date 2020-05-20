import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { Flatknapp } from 'nav-frontend-knapper';

export const KandidatlisterKnappeFilter: FunctionComponent<any> = ({
    kandidatlisterSokeKriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
}) => (
    <div>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${
                kandidatlisterSokeKriterier.kunEgne ? ' knapp--aktiv' : ''
            }`}
            onClick={onVisMineKandidatlister}
        >
            <Element>Mine kandidatlister</Element>
        </Flatknapp>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${
                kandidatlisterSokeKriterier.kunEgne ? '' : ' knapp--aktiv'
            }`}
            onClick={onVisAlleKandidatlister}
        >
            <Element>Alle kandidatlister</Element>
        </Flatknapp>
    </div>
);
