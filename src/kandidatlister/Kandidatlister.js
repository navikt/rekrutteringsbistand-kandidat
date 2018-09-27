import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import Feedback from '../feedback/Feedback';
import './kandidatlister.less';
import { RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';
import HjelpetekstFading from '../common/HjelpetekstFading';


class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visSuccessMelding: props.lagreStatus === LAGRE_STATUS.SUCCESS
        };
    }

    componentDidMount() {
        if (this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
            this.props.resetLagreStatus();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.skjulSuccessMeldingCallbackId);
    }

    skjulSuccessMelding = () => {
        this.setState({
            visSuccessMelding: false
        });
    };

    render() {
        return (
            <div>
                <Feedback />
                <HjelpetekstFading
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={this.props.opprettetTittel ? `Kandidatliste "${this.props.opprettetTittel}" opprettet` : 'Kandidatliste opprettet'}
                />
                <Container className="blokk-s container">
                    <Link to="/pam-kandidatsok/lister/opprett">
                        <Knapp role="link" type="standard">Opprett ny</Knapp>
                    </Link>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: [{
        id: 'aosidmsad123eqwd',
        tittel: 'Kokk, Oslo',
        oppdragsgiver: 'Restaurant MAT',
        opprettet: '28.05.2018',
        status: 'AKTIV',
        antallKandidater: 1
    }]
});

const mapDispatchToProps = (dispatch) => ({
    resetLagreStatus: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

Kandidatlister.defaultProps = {
    opprettetTittel: undefined
};

Kandidatlister.propTypes = {
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    opprettetTittel: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
