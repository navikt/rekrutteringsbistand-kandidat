import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Container, Row, Column } from 'nav-frontend-grid';
import './Feilside.less';

function refreshPage() {
    window.location.href = '/pam-kandidatsok-veileder';
}


const FeilsideIkkeInnlogget = () => (
    <Container className="blokk-s feilside">
        <Row>
            <Column>
                <AlertStripeAdvarsel type="advarsel" className="blokk-xs">
                    <div className="blokk-xs">
                        <strong>Du er ikke innlogget.</strong> Du må være logget inn for å få tilgang til kandidatsøket.
                        Forsøk å logge inn og laste siden på nytt.
                    </div>
                    <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
                </AlertStripeAdvarsel>
            </Column>
        </Row>
    </Container>
);

export default FeilsideIkkeInnlogget;
