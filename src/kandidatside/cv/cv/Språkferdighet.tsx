import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Språkferdighet as SpråkferdighetType } from '../reducer/cv-typer';

enum Språklabels {
    IkkeOppgitt = 'Ikke oppgitt',
    Nybegynner = 'Nybegynner',
    Godt = 'Godt',
    VeldigGodt = 'Veldig godt',
    Foerstespraak = 'Førstespråk (morsmål)',
}

type Props = {
    ferdighet: SpråkferdighetType;
};

const Språkferdighet: FunctionComponent<Props> = ({ ferdighet }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Element>{ferdighet.sprak}</Element>
            {ferdighet.ferdighetSkriftlig && (
                <Normaltekst>Skriftlig: {Språklabels[ferdighet.ferdighetSkriftlig]}</Normaltekst>
            )}
            {ferdighet.ferdighetMuntlig && (
                <Normaltekst>Muntlig: {Språklabels[ferdighet.ferdighetMuntlig]}</Normaltekst>
            )}
        </Row>
    );
};

export default Språkferdighet;
