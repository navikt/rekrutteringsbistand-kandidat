import React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Sidetittel, Undertittel, Element, Undertekst, Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import HjelpetekstFading from '../common/HjelpetekstFading';
import Lenkeknapp from '../common/Lenkeknapp';
import TomListe from './TomListe';
import {
    HENT_KANDIDATLISTER, RESET_LAGRE_STATUS, SLETT_KANDIDATLISTE,
    SLETT_KANDIDATLISTE_RESET_STATUS
} from './kandidatlisteReducer';
import { LAGRE_STATUS, SLETTE_STATUS } from '../../felles/konstanter';
import './kandidatlister.less';
import EndreModal from './EndreModal';
import PageHeader from '../common/PageHeaderWrapper';
import { CONTEXT_ROOT } from '../common/fasitProperties';

const Kandidatlistevisning = ({ fetching, kandidatlister, onEndreClick, onSletteClick }) => {
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
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} endreKandidatliste={onEndreClick} sletteKandidatliste={onSletteClick} />
        ))
    );
};

const formaterDato = (datoStreng) => {
    const dato = new Date(datoStreng);
    return dato.toLocaleDateString('nb-NO');
};

const KandidatlisteRad = ({ kandidatliste, endreKandidatliste, sletteKandidatliste }) => (
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
            <Lenkeknapp onClick={() => sletteKandidatliste(kandidatliste)} className="Delete">
                <i className="Delete__icon" />
                Slett
            </Lenkeknapp>
        </div>
    </div>
);


const Header = ({ antallKandidater }) => (
    <PageHeader>
        <div className="Kandidatlister__header--innhold">
            <div className="Kandidatlister__header--innhold--indre">
                <Sidetittel>Kandidatlister {antallKandidater > 0 && `(${antallKandidater})`}</Sidetittel>
                <Link to={`/${CONTEXT_ROOT}/lister/opprett`}>
                    <Knapp id="opprett-ny-liste" role="link" type="standard" className="knapp">Opprett ny</Knapp>
                </Link>
            </div>
        </div>
    </PageHeader>
);

const SlettKandidatlisteModal = ({ tittelKandidatliste, onAvbrytClick, onSletteClick, sletteStatus, antallKandidater }) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal slett kandidatliste"
        onRequestClose={onAvbrytClick}
        className="KandidatlisteDetalj__modal"
        closeButton
    >
        <Systemtittel className="blokk-s">Slett kandidatlisten</Systemtittel>
        <Normaltekst>Er du sikker på at du ønsker å slette kandidatlisten {'"'}{tittelKandidatliste || ''}{'"'} {`(${antallKandidater} ${antallKandidater === 1 ? 'kandidat' : 'kandidater'})`}?</Normaltekst>
        <div className="knapperad">
            <Hovedknapp onClick={onSletteClick} spinner={sletteStatus === SLETTE_STATUS.LOADING}>Slett</Hovedknapp>
            <Flatknapp onClick={onAvbrytClick}>Avbryt</Flatknapp>
        </div>
    </NavFrontendModal>
);

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        const visSuccessMld = props.lagreStatus === LAGRE_STATUS.SUCCESS;
        const visSuccessMldSlettet = props.sletteStatus === LAGRE_STATUS.SUCCESS;
        const successMld = (visSuccessMld && (this.props.opprettetTittel ?
            `Kandidatliste "${this.props.opprettetTittel}" opprettet` : 'Kandidatliste opprettet')) || '';
        this.state = {
            visSuccessMelding: visSuccessMld,
            visSuccessMeldingSlettet: visSuccessMldSlettet,
            successMelding: successMld,
            successMeldingSlettet: 'Kandidatliste slettet',
            visEndreModal: false,
            visSletteModal: false
        };
    }

    componentDidMount() {
        this.props.hentKandidatlister();
        if (this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
            this.props.resetLagreStatus();
        }
        if (this.props.sletteStatus === SLETTE_STATUS.SUCCESS) {
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMeldingSlettet, 5000);
            this.props.resetSletteStatus();
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
        if (prevProps.sletteStatus === SLETTE_STATUS.LOADING && this.props.sletteStatus === SLETTE_STATUS.SUCCESS) {
            this.props.hentKandidatlister();
            this.visSuccessMeldingSlettet(this.state.successMeldingSlettet);
            this.onLukkSletteModalClick();
            this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMeldingSlettet, 5000);
            this.props.resetSletteStatus();
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

    onDeleteClick = (kandidatliste) => {
        this.setState({
            visSletteModal: true,
            kandidatlisteISletting: kandidatliste,
            successMeldingSlettet: `Kandidatliste "${kandidatliste.tittel}" slettet`
        });
    };

    onLukkModalClick = () => {
        this.setState({
            visEndreModal: false,
            kandidatlisteIEndring: undefined
        });
    };

    onLukkSletteModalClick = () => {
        this.setState({
            visSletteModal: false,
            kandidatlisteISletting: undefined
        });
    };

    onSlettBekreft = () => {
        this.props.slettKandidatliste(this.state.kandidatlisteISletting.kandidatlisteId);
    };

    visSuccessMelding = (tekst) => {
        this.setState({
            visSuccessMelding: true,
            successMelding: tekst
        });
    };

    visSuccessMeldingSlettet = (tekst) => {
        this.setState({
            visSuccessMeldingSlettet: true,
            successMeldingSlettet: tekst
        });
    };

    skjulSuccessMelding = () => {
        this.setState({
            visSuccessMelding: false
        });
    };

    skjulSuccessMeldingSlettet = () => {
        this.setState({
            visSuccessMeldingSlettet: false
        });
    };

    render() {
        const { kandidatlister, fetchingKandidatlister } = this.props;
        return (
            <div>
                {this.state.visEndreModal && <EndreModal kandidatliste={this.state.kandidatlisteIEndring} onAvbrytClick={this.onLukkModalClick} />}
                {this.state.visSletteModal && <SlettKandidatlisteModal
                    tittelKandidatliste={this.state.kandidatlisteISletting.tittel}
                    onAvbrytClick={this.onLukkSletteModalClick}
                    onSletteClick={this.onSlettBekreft}
                    sletteStatus={this.props.sletteStatus}
                    antallKandidater={kandidatlister.find((kl) => kl.kandidatlisteId === this.state.kandidatlisteISletting.kandidatlisteId).antallKandidater}
                />}
                <HjelpetekstFading
                    id="kandidatliste-lagret-melding"
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={this.state.successMelding}
                />
                <HjelpetekstFading
                    id="kandidatliste-slettet-melding"
                    synlig={this.state.visSuccessMeldingSlettet}
                    type="suksess"
                    tekst={this.state.successMeldingSlettet}
                />
                <Header antallKandidater={kandidatlister !== undefined ? kandidatlister.length : 0} />
                <Container className="blokk-s container">
                    <div className="Kandidatlister__container Kandidatlister__container-width">
                        <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} onEndreClick={this.onEndreClick} onSletteClick={this.onDeleteClick} />
                    </div>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    sletteStatus: state.kandidatlister.slett.sletteStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.kandidatlister,
    fetchingKandidatlister: state.kandidatlister.fetchingKandidatlister,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => dispatch({ type: HENT_KANDIDATLISTER }),
    resetLagreStatus: () => dispatch({ type: RESET_LAGRE_STATUS }),
    resetSletteStatus: () => dispatch({ type: SLETT_KANDIDATLISTE_RESET_STATUS }),
    slettKandidatliste: (id) => dispatch({ type: SLETT_KANDIDATLISTE, kandidatlisteId: id })
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
    endreKandidatliste: PropTypes.func.isRequired,
    sletteKandidatliste: PropTypes.func.isRequired
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined
};

Header.propTypes = {
    antallKandidater: PropTypes.number.isRequired
};

Kandidatlister.propTypes = {
    sletteStatus: PropTypes.string.isRequired,
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    resetSletteStatus: PropTypes.func.isRequired,
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.bool.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    opprettetTittel: PropTypes.string,
    valgtArbeidsgiverId: PropTypes.string.isRequired,
    slettKandidatliste: PropTypes.func.isRequired
};

SlettKandidatlisteModal.propTypes = {
    onAvbrytClick: PropTypes.func.isRequired,
    onSletteClick: PropTypes.func.isRequired,
    tittelKandidatliste: PropTypes.string.isRequired,
    sletteStatus: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
