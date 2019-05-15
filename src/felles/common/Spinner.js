import React from 'react';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';

const Spinner = () => (
    <Container>
        <Row>
            <Column xs="12">
                <div className="text-center">
                    <NavFrontendSpinner type="M" />
                </div>
            </Column>
        </Row>
    </Container>
);

export default Spinner;
