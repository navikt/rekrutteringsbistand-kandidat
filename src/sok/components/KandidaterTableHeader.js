import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

export default function KandidaterTableHeader() {
    return (
        <div className="panel header--resultatvisning">
            <Row>
                <Column md="2" />
                <Column md="4">
                    <Element className="label--resultatvisning">Utdanning</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
                <Column md="3">
                    <Element className="label--resultatvisning">Jobberfaring</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
                <Column md="3">
                    <Element className="label--resultatvisning">År med erfaring</Element>
                    <NavFrontendChevron type="ned" />
                </Column>
            </Row>
        </div>
    );
}

