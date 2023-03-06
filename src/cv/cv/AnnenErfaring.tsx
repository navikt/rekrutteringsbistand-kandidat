import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { AnnenErfaring as AnnenErfaringType } from '../reducer/cv-typer';

type Props = {
    erfaring: AnnenErfaringType;
};

const AnnenErfaring: FunctionComponent<Props> = ({ erfaring }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode
                    fradato={erfaring.fraDato}
                    tildato={erfaring.tilDato}
                    navarende={!erfaring.tilDato}
                />
            </Undertekst>
            {erfaring.rolle && <Element>{erfaring.rolle}</Element>}
            {erfaring.beskrivelse && <Normaltekst>{erfaring.beskrivelse}</Normaltekst>}
        </Row>
    );
};

export default AnnenErfaring;
