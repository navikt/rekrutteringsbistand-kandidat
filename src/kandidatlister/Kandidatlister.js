import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel, Element } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Feedback from '../feedback/Feedback';
import HjelpetekstFading from '../common/HjelpetekstFading';
import EditIkon from '../common/ikon/EditIkon';
import SlettIkon from '../common/ikon/SlettIkon';
import { HENT_KANDIDATLISTER, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';

import './kandidatlister.less';

const Kandidatlistevisning = ({ fetching, kandidatlister }) => {
    if (fetching || kandidatlister === undefined) {
        return <NavFrontendSpinner type="L" />;
    } else if (kandidatlister.length === 0) {
        return 'Ingen kandidatlister';
    }
    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} />
        ))
    );
};

const IkonKnapp = ({ Ikon, tekst, onClick }) => (
    <button onClick={onClick} className="Kandidatlister--ikon-knapp">
        <Ikon className="Kandidatlister--ikon" />
        {tekst}
    </button>
);

const formaterDato = (datoStreng) => {
    const dato = new Date(datoStreng);
    return dato.toLocaleDateString('no-nb').replace(/\//g, '.');
};

const KandidatlisteRad = ({ kandidatliste }) => (
    <div className="Kandidatliste-panel">
        <div className="Kandidatliste--panel--beskrivelse">
            <div className="Kandidatliste--panel--topp">
                <div>
                    <Link to={`/pam-kandidatsok/lister/detaljer/${kandidatliste.kandidatlisteId}`} className="lenke" >
                        <Undertittel className="KandidatlisteRad--panel--overskrift">{kandidatliste.tittel}</Undertittel>
                    </Link>
                </div>
                <div className="KandidatlisteRad--panel--dato-opprettet">
                    {`Opprettet: ${formaterDato(kandidatliste.opprettetTidspunkt)}`}
                </div>
            </div>
            <Element className="Kandidatlister-kandidatantall">
                {
                    kandidatliste.antallKandidater === 1 ?
                        '1 kandidat' :
                        `${kandidatliste.antallKandidater} kandidater`
                }
            </Element>
            {kandidatliste.oppdragsgiver &&
            <div className="Kandidatliste-oppdragsgiver">
                {`Oppdragsgiver: ${kandidatliste.oppdragsgiver}`}
            </div>}
        </div>
        <div className="Kandidatliste-funksjonsknapp-panel">
            <IkonKnapp Ikon={EditIkon} tekst="Endre" onClick={() => { console.log('endre'); }} />
            <IkonKnapp Ikon={SlettIkon} tekst="Slett" onClick={() => { console.log('slett'); }} />
        </div>
    </div>
);

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visSuccessMelding: props.lagreStatus === LAGRE_STATUS.SUCCESS
        };
    }

    componentDidMount() {
        this.props.hentKandidatlister();
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
        const { kandidatlister, fetchingKandidatlister } = this.props;
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
                    <Container className="Kandidatlister__container Kandidatlister__container-width">
                        <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} />
                    </Container>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.lagreStatus,
    opprettetTittel: state.kandidatlister.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.kandidatlister,
    fetchingKandidatlister: state.kandidatlister.fetchingKandidatlister
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => { dispatch({ type: HENT_KANDIDATLISTER }); },
    resetLagreStatus: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    oppdragsgiver: PropTypes.string
});

IkonKnapp.propTypes = {
    Ikon: PropTypes.func.isRequired,
    tekst: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

KandidatlisteRad.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined
};

Kandidatlister.propTypes = {
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.bool.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    opprettetTittel: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
