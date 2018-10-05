import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Sidetittel, Undertittel, Element, Undertekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import HjelpetekstFading from '../common/HjelpetekstFading';
import Lenkeknapp from '../common/Lenkeknapp';
import TomListe from './TomListe';
import { HENT_KANDIDATLISTER, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';
import './kandidatlister.less';
import EndreModal from './EndreModal';
import PageHeader from '../common/PageHeaderWrapper';
import UnderArbeidSide from './UnderArbeidSide';
import { CONTEXT_ROOT } from '../common/fasitProperties';

const Kandidatlistevisning = ({ fetching, kandidatlister, onEndreClick }) => {
    if (fetching || kandidatlister === undefined) {
        return <div className="text-center"> <NavFrontendSpinner type="L" /></div>;
    } else if (kandidatlister.length === 0) {
        return (
            <TomListe
                lenke={`/${CONTEXT_ROOT}/lister/opprett`}
                lenkeTekst="Opprett kandidatliste"
            >
                Du har ingen kandidatlister
            </TomListe>);
    }

    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} endreKandidatliste={onEndreClick} />
        ))
    );
};

const formaterDato = (datoStreng) => {
    const dato = new Date(datoStreng);
    return dato.toLocaleDateString('nb-NO');
};

const KandidatlisteRad = ({ kandidatliste, endreKandidatliste }) => (
    <div className="Kandidatliste__panel">
        <div className="beskrivelse">
            <div className="topp">
                <div>
                    <Link to={`/${CONTEXT_ROOT}/lister/detaljer/${kandidatliste.kandidatlisteId}`} className="lenke" >
                        <Undertittel className="overskrift">{kandidatliste.tittel}</Undertittel>
                    </Link>
                </div>
                <div className="dato-opprettet">
                    <Undertekst>{`Opprettet: ${formaterDato(kandidatliste.opprettetTidspunkt)}`}</Undertekst>
                </div>
            </div>
            <Element className="kandidatantall">
                {
                    kandidatliste.antallKandidater === 1 ?
                        '1 kandidat' :
                        `${kandidatliste.antallKandidater} kandidater`
                }
            </Element>
            {kandidatliste.oppdragsgiver &&
            <div className="oppdragsgiver typo-normal">
                {`Oppdragsgiver: ${kandidatliste.oppdragsgiver}`}
            </div>}
        </div>
        <div className="funksjonsknapp-panel">
            <Lenkeknapp onClick={() => endreKandidatliste(kandidatliste)} className="Edit">
                <i className="Edit__icon" />
                Endre
            </Lenkeknapp>
            {/* <Lenkeknapp onClick={() => { console.log('slett'); }} className="Delete">
                <i className="Delete__icon" />
                Slett
            </Lenkeknapp> */}
        </div>
    </div>
);

const Header = ({ antallKandidater }) => (
    <PageHeader>
        <div className="Kandidatlister__header--innhold">
            <Sidetittel>Kandidatlister {antallKandidater > 0 && `(${antallKandidater})`}</Sidetittel>
            <Link to={`/${CONTEXT_ROOT}/lister/opprett`}>
                <Knapp role="link" type="standard" className="knapp">Opprett ny</Knapp>
            </Link>
        </div>
    </PageHeader>
);

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        const visSuccessMld = props.lagreStatus === LAGRE_STATUS.SUCCESS;
        const successMld = (visSuccessMld && (this.props.opprettetTittel ?
            `Kandidatliste "${this.props.opprettetTittel}" opprettet` : 'Kandidatliste opprettet')) || '';
        this.state = {
            visSuccessMelding: visSuccessMld,
            successMelding: successMld,
            visEndreModal: false
        };
    }

    componentDidMount() {
        this.props.hentKandidatlister();
        if (this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
            this.props.resetLagreStatus();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lagreStatus === LAGRE_STATUS.LOADING && this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            this.props.hentKandidatlister();
            this.visSuccessMelding('Endringene er lagret');
            this.onLukkModalClick();
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
            this.props.resetLagreStatus();
        }
        if (this.props.valgtArbeidsgiverId !== prevProps.valgtArbeidsgiverId) {
            this.props.hentKandidatlister();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.skjulSuccessMeldingCallbackId);
    }

    onEndreClick = (kandidatliste) => {
        this.setState({
            visEndreModal: true,
            kandidatlisteIEndring: kandidatliste
        });
    };

    onLukkModalClick = () => {
        this.setState({
            visEndreModal: false,
            kandidatlisteIEndring: undefined
        });
    };

    visSuccessMelding = (tekst) => {
        this.setState({
            visSuccessMelding: true,
            successMelding: tekst
        });
    };

    skjulSuccessMelding = () => {
        this.setState({
            visSuccessMelding: false
        });
    };

    render() {
        // TODO: Fjern featureToggle
        const { kandidatlister, fetchingKandidatlister, skalViseKandidatlister } = this.props;
        if (!skalViseKandidatlister) {
            return <UnderArbeidSide />;
        }
        return (
            <div>
                {this.state.visEndreModal && <EndreModal kandidatliste={this.state.kandidatlisteIEndring} onAvbrytClick={this.onLukkModalClick} />}
                <HjelpetekstFading
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={this.state.successMelding}
                />
                <Header antallKandidater={kandidatlister !== undefined ? kandidatlister.length : 0} />
                <Container className="blokk-s container">
                    <Container className="Kandidatlister__container Kandidatlister__container-width">
                        <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} onEndreClick={this.onEndreClick} />
                    </Container>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.kandidatlister,
    fetchingKandidatlister: state.kandidatlister.fetchingKandidatlister,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId,
    skalViseKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => { dispatch({ type: HENT_KANDIDATLISTER }); },
    resetLagreStatus: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

export const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    oppdragsgiver: PropTypes.string
});

KandidatlisteRad.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired,
    endreKandidatliste: PropTypes.func.isRequired
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined
};

Header.propTypes = {
    antallKandidater: PropTypes.number.isRequired
};

Kandidatlister.propTypes = {
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.bool.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    opprettetTittel: PropTypes.string,
    skalViseKandidatlister: PropTypes.bool.isRequired,
    valgtArbeidsgiverId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
