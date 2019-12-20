import React, { useEffect } from 'react';
import { Innholdstittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import Ikon from 'nav-frontend-ikoner-assets';
import { Panel } from 'nav-frontend-paneler';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { recordNoRightsEvent } from '../../../felles/googleanalytics';

const LENKE_RETTIGHETER = 'https://altinn.no/hjelp/profil/roller-og-rettigheter/';

const ManglerRolleAltinn = () => {
    useEffect(() => {
        localStorage.setItem('innloggetBrukerKontekst', 'ingen-arbeidsgivertilgang');
        recordNoRightsEvent();
    }, []);

    return (
        <Container className="container-arbeidsgiver">
            <AlertStripeAdvarsel className="blokk-xs alertstripe--solid">
                <div>
                    <Element>Nedetid for arbeidsgivertjenestene 1. januar</Element>
                    <Normaltekst>
                        Onsdag 1. januar kl. 17:00 til 23:00 kan du ikke benytte arbeidsgivertjenestene
                        på arbeidsplassen.no. Det er på grunn av nedetid i Altinn relatert til
                        Kommune- og fylkessammenslåingen.
                    </Normaltekst>
                </div>
            </AlertStripeAdvarsel>
            <Panel className="blokk-l">
                <Row className="blokk-xs text-center">
                    <Ikon kind="info-sirkel-fyll" />
                </Row>
                <Row className="text-center blokk-s">
                    <Innholdstittel>Du mangler rettigheter i Altinn</Innholdstittel>
                </Row>
                <Row>
                    <Column xs="12">
                        <Normaltekst>
                            Bruk av våre rekrutteringstjenester forutsetter at du har fått tilgang til
                            Altinn-tjenesten Rekruttering for virksomheten du representerer.
                            Disse rollene gir deg automatisk tilgang:
                        </Normaltekst>
                        <ul>
                            <Normaltekst>
                                <li>Utfyller/Innsender</li>
                                <li>Lønn og personalmedarbeider</li>
                            </Normaltekst>
                        </ul>
                        <Normaltekst className="blokk-s">
                            Alternativt kan du få tilgang til enkelttjenesten Rekruttering.
                        </Normaltekst>
                        <Element className="blokk-xxs">
                            Informasjon om tildeling av rettigheter i Altinn
                        </Element>
                        <Normaltekst className="blokk-s">
                            Det er virksomheten som må gi deg tilgang.
                            Tilgang kan delegeres av personer som selv har tilgang,
                            dersom de også har rollen Tilgangsstyring.
                        </Normaltekst>
                        <Normaltekst className="blokk-s">
                            I store virksomheter er det vanlig at HR-personell har fått tilgangsstyring fra ledelsen for å
                            kunne delegere Altinn-roller på vegne av virksomheten.
                            Hvis tilgangsstyring ikke er delegert til HR-personell må man få tildelt tilgang fra
                            daglig leder eller andre fra eiersiden.
                        </Normaltekst>
                        <Normaltekst className="blokk-s">
                            Mer informasjon om tildeling av roller og rettigheter finnes på{' '}
                            <a
                                className="link"
                                href={LENKE_RETTIGHETER}
                            >
                                altinn.no
                            </a>
                            .
                        </Normaltekst>
                    </Column>
                </Row>
            </Panel>
        </Container>
    );
};

export default ManglerRolleAltinn;
