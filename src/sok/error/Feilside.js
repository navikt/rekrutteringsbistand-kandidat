import React from 'react';
import { Container, Row, Column } from 'nav-frontend-grid';
import Feilmelding from './Feilmelding';

const Feilside = () => (
    <Container className="blokk-s">
        <Row>
            <Column>
                <Feilmelding />
            </Column>
        </Row>
    </Container>
);

export default Feilside;
