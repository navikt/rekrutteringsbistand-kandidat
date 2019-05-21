import React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Flatknapp, Hovedknapp, Knapp } from 'pam-frontend-knapper';
import { Undertittel, Element, Undertekst, Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import TomListe from '../../felles/kandidatlister/TomListe';
import { KandidatlisteTypes } from './kandidatlisteReducer.ts';
import { LAGRE_STATUS, SLETTE_STATUS } from '../../felles/konstanter';
import './kandidatlister.less';
import EndreModal from './EndreModal';
import PageHeader from '../../felles/common/PageHeaderWrapper';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import { formatterDato } from '../../felles/common/dateUtils';
import OpprettModal from './OpprettModal';
import Sidetittel from '../../felles/common/Sidetittel.tsx';

const Kandidatlistevisning = ({ fetching, kandidatlister, onEndreClick, onSletteClick, onOpprettClick }) => {
    if (fetching || kandidatlister === undefined) {
        return <div className="text-center"><NavFrontendSpinner type="L" /></div>;
    } else if (kandidatlister.length === 0) {
        return (
            <TomListe
                knappTekst="Opprett kandidatliste"
                onClick={onOpprettClick}
            >
                Du har ingen kandidatlister
            </TomListe>
        );
    }

    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={kandidatliste.kandidatlisteId} endreKandidatliste={onEndreClick} sletteKandidatliste={onSletteClick} />
        ))
    );
};

const MODALVISING = {
    INGEN_MODAL: 'INGEN_MODAL',
    OPPRETT_MODAL: 'OPPRETT_MODAL',
    ENDRE_MODAL: 'ENDRE_MODAL',
    SLETTE_MODAL: 'SLETTE_MODAL'
};

const KandidatlisteHeader = ({ antallKandidatlister, onOpprettClick }) => (
    <div className="thead">
        <div className="th KandidatlisteHeader">
            <div>
                <div className="td">Antall lister:</div>
                <div className="Kandidatlister__count td">{antallKandidatlister}</div>
            </div>
            <div>
                <Knapp
                    onClick={onOpprettClick}
                    id="opprett-ny-liste"
                    role="link"
                    type="standard"
                >
                    Opprett ny
                </Knapp>
            </div>
        </div>
    </div>
);

const KandidatlisteRad = ({ kandidatliste, endreKandidatliste, sletteKandidatliste }) => (
    <div className="Kandidatliste__panel tr">
        <div className="beskrivelse">
            {kandidatliste.opprettetAvNav &&
                <div className="delt-fra-nav-rad">
                    <div className="etikett">
                        Kandidatliste fra NAV
                    </div>
                    <div className="logo">
                        <i className="NAV-loco-ikon__svart" />
                    </div>
                </div>
            }
            <div className="topp">
                <div>
                    <Undertittel className="overskrift">
                        <Link to={`/${CONTEXT_ROOT}/lister/detaljer/${kandidatliste.kandidatlisteId}`} className="link" >
                            {kandidatliste.tittel}
                        </Link>
                    </Undertittel>
                </div>
                {!kandidatliste.opprettetAvNav &&
                    <Undertekst>{`Opprettet: ${formatterDato(new Date(kandidatliste.opprettetTidspunkt))}`}</Undertekst>
                }
            </div>
            <div className="beskrivelse-rad">
                <div>
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
                        </div>
                    }
                </div>
                {kandidatliste.opprettetAvNav &&
                    <Undertekst>{`Opprettet: ${formatterDato(new Date(kandidatliste.opprettetTidspunkt))}`}</Undertekst>
                }
            </div>
        </div>
        <div className="funksjonsknapp-panel">
            <Lenkeknapp onClick={() => endreKandidatliste(kandidatliste)} className="Edit">
                Endre
                <i className="Edit__icon" />
            </Lenkeknapp>
            <Lenkeknapp onClick={() => sletteKandidatliste(kandidatliste)} className="Delete">
                Slett
                <i className="Delete__icon" />
            </Lenkeknapp>
        </div>
    </div>
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
            <Hovedknapp
                onClick={onSletteClick}
                spinner={sletteStatus === SLETTE_STATUS.LOADING}
                disabled={sletteStatus === SLETTE_STATUS.LOADING}
            >
                Slett
            </Hovedknapp>
            <Flatknapp
                onClick={onAvbrytClick}
                disabled={sletteStatus === SLETTE_STATUS.LOADING}
            >
                Avbryt
            </Flatknapp>
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
            modalstatus: MODALVISING.INGEN_MODAL
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

    onOpprettClick = () => {
        this.setState({
            modalstatus: MODALVISING.OPPRETT_MODAL
        });
    };

    onEndreClick = (kandidatliste) => {
        this.setState({
            modalstatus: MODALVISING.ENDRE_MODAL,
            kandidatlisteIEndring: kandidatliste
        });
    };

    onDeleteClick = (kandidatliste) => {
        this.setState({
            modalstatus: MODALVISING.SLETTE_MODAL,
            kandidatlisteISletting: kandidatliste,
            successMeldingSlettet: `Kandidatliste "${kandidatliste.tittel}" slettet`
        });
    };

    onLukkModalClick = () => {
        this.setState({
            modalstatus: MODALVISING.INGEN_MODAL,
            kandidatlisteIEndring: undefined
        });
    };

    onLukkSletteModalClick = () => {
        this.setState({
            modalstatus: MODALVISING.INGEN_MODAL,
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
        const Header = () => (
            <PageHeader>
                <div className="Kandidatlister__header--innhold">
                    <Sidetittel>Kandidatlister</Sidetittel>
                </div>
            </PageHeader>
        );
        return (
            <div>
                {this.state.modalstatus === MODALVISING.ENDRE_MODAL && <EndreModal kandidatliste={this.state.kandidatlisteIEndring} onAvbrytClick={this.onLukkModalClick} />}
                {this.state.modalstatus === MODALVISING.OPPRETT_MODAL && <OpprettModal onAvbrytClick={this.onLukkModalClick} />}
                {this.state.modalstatus === MODALVISING.SLETTE_MODAL && <SlettKandidatlisteModal
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
                <Header />
                <Container className="blokk-s container">
                    <div className="Kandidatlister__container Kandidatlister__container-width table">
                        {kandidatlister !== undefined && kandidatlister.length > 0 && (
                            <KandidatlisteHeader
                                antallKandidatlister={kandidatlister.length}
                                onOpprettClick={this.onOpprettClick}
                            />
                        )}
                        <div className="tbody">
                            <Kandidatlistevisning
                                kandidatlister={kandidatlister}
                                fetching={fetchingKandidatlister}
                                onEndreClick={this.onEndreClick}
                                onSletteClick={this.onDeleteClick}
                                onOpprettClick={this.onOpprettClick}
                            />
                        </div>
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
    hentKandidatlister: () => dispatch({ type: KandidatlisteTypes.HENT_KANDIDATLISTER }),
    resetLagreStatus: () => dispatch({ type: KandidatlisteTypes.RESET_LAGRE_STATUS }),
    resetSletteStatus: () => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATLISTE_RESET_STATUS }),
    slettKandidatliste: (id) => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATLISTE, kandidatlisteId: id })
});

export const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    opprettetAvNav: PropTypes.bool.isRequired,
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

KandidatlisteHeader.propTypes = {
    antallKandidatlister: PropTypes.number.isRequired,
    onOpprettClick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
