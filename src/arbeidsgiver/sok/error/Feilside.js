import React from 'react';
import { Container, Row, Column } from 'nav-frontend-grid';
import { PropTypes } from 'prop-types';
import { Footer } from 'pam-frontend-footer';
import Feilmelding from './Feilmelding';
import './Feilside.less';
import ManglerRolleAltinn from './ManglerRolleAltinn';
import TomToppmeny from '../../common/toppmeny/TomToppmeny';

const Feilside = ({ error }) => (
    <div className="Application">
        <div className="Application__main">
            <TomToppmeny />
            <Container className="blokk-s feilside">
                <Row>
                    <Column>
                        {error.status === 403 ? (
                            <ManglerRolleAltinn />
                        ) : (
                            <Feilmelding />
                        )}
                    </Column>
                </Row>
            </Container>
        </div>
        <Footer />
    </div>
);

Feilside.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }).isRequired
};

export default Feilside;
