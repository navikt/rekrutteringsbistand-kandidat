import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { Sertifikat as SertifikatType } from '../reducer/cv-typer';

type Props = {
    sertifikat: SertifikatType;
};

const Sertifikat: FunctionComponent<Props> = ({ sertifikat }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode fradato={sertifikat.fraDato} />
            </Undertekst>
            {sertifikat.utsteder && <Normaltekst>{sertifikat.utsteder}</Normaltekst>}
            <Element>
                {sertifikat.alternativtNavn
                    ? sertifikat.alternativtNavn
                    : sertifikat.sertifikatKodeNavn}
            </Element>
            {sertifikat.tilDato && (
                <Normaltekst>
                    Utløper: <Tidsperiode tildato={sertifikat.tilDato} />
                </Normaltekst>
            )}
        </Row>
    );
};

export default Sertifikat;
