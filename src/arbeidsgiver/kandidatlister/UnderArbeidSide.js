import React from 'react';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import './UnderArbeidSide.less';

const UnderArbeidSide = () => (
    <Container>
        <Row className="blokk-m mt-l text-center">
            <Column xs="12">
                <div className="under-arbeid">
                    <div>
                        <Undertittel className="typo-undertittel--normal blokk-m">
                            Tjenesten er under arbeid
                        </Undertittel>
                    </div>
                </div>
            </Column>
        </Row>
    </Container>
);
export default UnderArbeidSide;
