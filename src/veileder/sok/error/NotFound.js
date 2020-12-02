import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';

const NotFound = () => (
    <Container className="blokk-s">
        <Row>
            <Column className="text-center feilside">
                <Innholdstittel>
                    Finner ikke siden{' '}
                    <span role="img" aria-label="confused emoji">
                        😕
                    </span>
                </Innholdstittel>
            </Column>
        </Row>
    </Container>
);

export default NotFound;
