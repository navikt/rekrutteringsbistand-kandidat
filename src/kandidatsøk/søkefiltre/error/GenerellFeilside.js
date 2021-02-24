import React from 'react';
import { Container, Row, Column } from 'nav-frontend-grid';
import Feilmelding from './Feilmelding';
import './Feilside.less';

const GenerellFeilside = () => (
    <Container className="blokk-s feilside">
        <Row>
            <Column>
                <Feilmelding />
            </Column>
        </Row>
    </Container>
);

export default GenerellFeilside;
