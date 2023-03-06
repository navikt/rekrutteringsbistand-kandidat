import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { Sertifikat } from '../reducer/cv-typer';

type Props = {
    førerkort: Sertifikat;
};

const Førerkort: FunctionComponent<Props> = ({ førerkort }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode fradato={førerkort.fraDato} tildato={førerkort.tilDato} />
            </Undertekst>
            <Normaltekst>
                {førerkort.alternativtNavn
                    ? førerkort.alternativtNavn
                    : førerkort.sertifikatKodeNavn}
            </Normaltekst>
        </Row>
    );
};

export default Førerkort;
