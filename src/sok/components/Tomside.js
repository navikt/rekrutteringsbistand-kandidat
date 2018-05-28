import React from 'react';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

export default function TomSide() {
    return (
        <Container className="container-width">
            <Row className="blokk-l mt-l">
                <Column xs="12" className="wrench box">
                    <Undertittel className="blokk-xs">Her er det ingen ting enda</Undertittel>
                    <Normaltekst className="typo-normal blokk-xxs">
                        ...men vi jobber med saken!
                    </Normaltekst>
                    <Link id="link-soknader" to="/pam-kandidatsok/forside" className="lenke typo-normal">
                        Tilbake
                    </Link>
                </Column>
            </Row>
        </Container>
    );
}
