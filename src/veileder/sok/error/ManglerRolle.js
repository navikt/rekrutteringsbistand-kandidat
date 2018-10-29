import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';

export default function ManglerRolle() {
    return (
        <div>
            <Container className="blokk-s">
                <Row>
                    <Column className="text-center">
                        <Innholdstittel>Ups, det ser ut som du mangler korrekt rolle.</Innholdstittel>
                    </Column>
                </Row>
            </Container>
        </div>
    );
}
