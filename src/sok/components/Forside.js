import React from 'react';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel, Undertittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

export default function Forside() {
    return (
        <Container className="container-width">
            <Row className="blokk-s mt-l text-center">
                <Sidetittel >Vår side</Sidetittel>
            </Row>
            <Row >
                <Column xs="12" sm="6" >
                    <div className="ny-annonse box">
                        <Undertittel className="blokk-xs">Ny stillingsannonse</Undertittel>
                        <Normaltekst className="typo-normal blokk-xxs">
                            Legg inn en stillingsannonse og få litt hjelp på veien <br /><br />
                        </Normaltekst>
                        <Link
                            id="link-ny-annonse"
                            to="/pam-kandidatsok/annonse"
                            className="lenke typo-normal"
                        >
                            Opprett ny stillingsannonse
                        </Link>
                    </div>
                </Column>
                <Column xs="12" sm="6">
                    <div className="kandidatsok box">
                        <Undertittel className="blokk-xs">Kandidatsøk</Undertittel>
                        <Normaltekst className="typo-normal blokk-xxs">
                            Det er nå 3205 kandidater som ønsker seg en jobb, sjekk om noen av disse
                            passer i din bedrift
                        </Normaltekst>
                        <Link id="link-kandidatsok" to="/pam-kandidatsok" className="lenke typo-normal">
                            Søk etter kandidat
                        </Link>
                    </div>
                </Column>
            </Row>
            <Row className="blokk-l" >
                <Column xs="12" sm="6">
                    <div className="soknader box">
                        <Undertittel className="blokk-xs">Søknader</Undertittel>
                        <Normaltekst className="typo-normal blokk-xxs">
                            Innkomne søknader som er sendt i tjenesten vil ligge her. Det
                            er 23 nye søknader
                        </Normaltekst>
                        <Link id="link-soknader" to="/pam-kandidatsok/soknader" className="lenke typo-normal">
                            Gå til innkomne søknader
                        </Link>
                    </div>
                </Column>
                <Column xs="12" sm="6">
                    <div className="fastesok box">
                        <Undertittel className="blokk-xs">Faste søk</Undertittel>
                        <Normaltekst className="typo-normal blokk-xxs">
                            Du kan lagre søk etter ulike typer kandidater<br /><br />
                        </Normaltekst>
                        <Link id="link-faste-sok" to="/pam-kandidatsok/fastesok" className="lenke typo-normal">
                            Gå til dine faste søk
                        </Link>
                    </div>
                </Column>
            </Row>
        </Container>
    );
}
