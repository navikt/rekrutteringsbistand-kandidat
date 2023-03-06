import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { Yrkeserfaring as YrkeserfaringType } from '../reducer/cv-typer';

type Props = {
    erfaring: YrkeserfaringType;
};

const Yrkeserfaring: FunctionComponent<Props> = ({ erfaring }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode
                    fradato={erfaring.fraDato}
                    tildato={erfaring.tilDato}
                    navarende={!erfaring.tilDato}
                />
            </Undertekst>
            {erfaring.arbeidsgiver && !erfaring.sted && (
                <Normaltekst>{erfaring.arbeidsgiver}</Normaltekst>
            )}
            {erfaring.arbeidsgiver && erfaring.sted && (
                <Normaltekst>{`${erfaring.arbeidsgiver} | ${erfaring.sted}`}</Normaltekst>
            )}
            {!erfaring.arbeidsgiver && erfaring.sted && <Normaltekst>{erfaring.sted}</Normaltekst>}
            {
                <Element>
                    {erfaring.alternativStillingstittel
                        ? erfaring.alternativStillingstittel
                        : erfaring.styrkKodeStillingstittel}
                </Element>
            }
            {erfaring.beskrivelse && <Normaltekst>{erfaring.beskrivelse}</Normaltekst>}
        </Row>
    );
};

export default Yrkeserfaring;
