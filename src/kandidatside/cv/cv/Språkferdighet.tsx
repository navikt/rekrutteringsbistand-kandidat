import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Språkferdighet as SpråkferdighetType } from '../reducer/cv-typer';

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

const språkferdighetTilVisningsnavn = (ferdighet: string) => {
    switch (ferdighet) {
        case 'IKKEOPPGITT':
            return 'Ikke oppgitt';
        case 'NYBEGYNNER':
            return 'Nybegynner';
        case 'GODT':
            return 'Godt';
        case 'VELDIGGODT':
            return 'Veldig godt';
        case 'FOERSTESPRAAK':
            return 'Førstespråk (morsmål)';
        default:
            return 'Ikke oppgitt';
    }
};

export default Språkferdighet;
