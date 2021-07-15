import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { Utdanning as UtdanningType } from '../reducer/cv-typer';

type Props = { utdanning: UtdanningType };

const Utdanning: FunctionComponent<Props> = ({ utdanning }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode fradato={utdanning.fraDato} tildato={utdanning.tilDato} />
            </Undertekst>
            {utdanning.utdannelsessted && <Normaltekst>{utdanning.utdannelsessted}</Normaltekst>}
            <Element>
                {utdanning.alternativtUtdanningsnavn
                    ? utdanning.alternativtUtdanningsnavn
                    : utdanning.nusKodeUtdanningsnavn}
            </Element>
            {utdanning.beskrivelse && <Normaltekst>{utdanning.beskrivelse}</Normaltekst>}
        </Row>
    );
};

export default Utdanning;
