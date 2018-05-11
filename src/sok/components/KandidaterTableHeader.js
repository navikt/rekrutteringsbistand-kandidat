import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

export default function KandidaterTableHeader() {
    return (
        <div className="panel border--bottom--medium">
            <Row>
                <Column xs="2" md="2" />
                <Column xs="4" md="4">
                    <Element className="label--resultatvisning">Utdanning</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
                <Column xs="3" md="3">
                    <Element className="label--resultatvisning">Jobberfaring</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
                <Column xs="3" md="3">
                    <Element className="label--resultatvisning">År med erfaring</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
            </Row>
        </div>
    );
}

