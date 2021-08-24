import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Språkferdighet as SpråkferdighetType, Språkferdighetsnivå } from '../reducer/cv-typer';

type Props = {
    ferdighet: SpråkferdighetType;
};

const Språkferdighet: FunctionComponent<Props> = ({ ferdighet }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Element>{ferdighet.sprak}</Element>
            {ferdighet.ferdighetSkriftlig && (
                <Normaltekst>
                    Skriftlig: {språkferdighetTilVisningsnavn(ferdighet.ferdighetSkriftlig)}
                </Normaltekst>
            )}
            {ferdighet.ferdighetMuntlig && (
                <Normaltekst>
                    Muntlig: {språkferdighetTilVisningsnavn(ferdighet.ferdighetMuntlig)}
                </Normaltekst>
            )}
        </Row>
    );
};

const språkferdighetTilVisningsnavn = (ferdighet: Språkferdighetsnivå) => {
    switch (ferdighet) {
        case Språkferdighetsnivå.IkkeOppgitt:
            return 'Ikke oppgitt';
        case Språkferdighetsnivå.Nybegynner:
            return 'Nybegynner';
        case Språkferdighetsnivå.Godt:
            return 'Godt';
        case Språkferdighetsnivå.VeldigGodt:
            return 'Veldig godt';
        case Språkferdighetsnivå.Førstespråk:
            return 'Førstespråk (morsmål)';
        default:
            return 'Ikke oppgitt';
    }
};

export default Språkferdighet;
