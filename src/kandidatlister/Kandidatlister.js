import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import Feedback from '../feedback/Feedback';
import './kandidatlister.less';


const Kandidatlister = () => (
    <div>
        <Feedback />
        <Container className="blokk-s container">
            <Link to="/pam-kandidatsok/lister/opprett">
                <Knapp role="link" type="standard">Opprett ny</Knapp>
            </Link>
        </Container>
    </div>
);

const mapStateToProps = () => ({
    kandidatlister: [{
        id: 'aosidmsad123eqwd',
        tittel: 'Kokk, Oslo',
        oppdragsgiver: 'Restaurant MAT',
        opprettet: '28.05.2018',
        status: 'AKTIV',
        antallKandidater: 1
    }]
});

export default connect(mapStateToProps)(Kandidatlister);
