import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';

const ListeHeader: FunctionComponent = () => (
    <div className="liste-header liste-rad-innhold">
        <div className="kolonne-middels">
            <Element>Dato opprettet</Element>
        </div>
        <div className="kolonne-bred">
            <Element>Navn på kandidatliste</Element>
        </div>
        <div className="kolonne-middels">
            <Element>Antall kandidater</Element>
        </div>
        <div className="kolonne-bred">
            <Element>Veileder</Element>
        </div>
        <div className="kolonne-middels__finn-kandidater">
            <Element>Finn kandidater</Element>
        </div>
        <div className="kolonne-smal">
            <Element>Rediger</Element>
        </div>
        <div className="kolonne-smal">
            <Element>Meny</Element>
        </div>
    </div>
);

export default ListeHeader;
