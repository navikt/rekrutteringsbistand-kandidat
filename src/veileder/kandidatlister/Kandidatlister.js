import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Sidetittel, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { HENT_KANDIDATLISTER, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { formatterDato } from '../../felles/common/dateUtils';
import './Kandidatlister.less';
import OpprettModal from './OpprettModal';
import TomListe from '../../felles/kandidatlister/TomListe';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';

const MODALVISING = {
    INGEN_MODAL: 'INGEN_MODAL',
    OPPRETT_MODAL: 'OPPRETT_MODAL'
};

const SideHeader = ({ opprettListe }) => (
    <div className="side-header">
        <div className="side-header__innhold">
            <div className="header-child" />
            <div className="header-child tittel-wrapper">
                <Sidetittel>Kandidatlister</Sidetittel>
            </div>
            <div className="header-child knapp-wrapper">
                <Hovedknapp onClick={opprettListe} id="opprett-ny-liste">Opprett ny</Hovedknapp>
            </div>
        </div>
    </div>
);

const Kandidatlistevisning = ({ fetching, kandidatlister }) => {
    if (fetching !== 'SUCCESS' || kandidatlister === undefined) {
        return <div className="text-center"><NavFrontendSpinner type="L" /></div>;
    } else if (kandidatlister.length === 0) {
        return (
            <div>
                <TomListe>Du har ingen kandidatlister</TomListe>
            </div>
        );
    }

    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} />
        ))
    );
};

const ListeHeader = () => (
    <div className="liste-header liste-rad-innhold">
        <div className="kolonne-middels"><Element>Dato opprettet</Element></div>
        <div className="kolonne-bred"><Element>Navn på kandidatliste</Element></div>
        <div className="kolonne-middels"><Element>Antall kandidater</Element></div>
        <div className="kolonne-bred"><Element>Opprettet av</Element></div>
    </div>
);

const KandidatlisteRad = ({ kandidatliste }) => (
    <div className="liste-rad liste-rad-innhold">
        <div className="kolonne-middels"><Normaltekst>{`${formatterDato(new Date(kandidatliste.opprettetTidspunkt))}`}</Normaltekst></div>
        <div className="kolonne-bred">
            <Link
                to={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                className="lenke"
            >
                <Normaltekst>{kandidatliste.tittel}</Normaltekst>
            </Link>
        </div>
        <div className="kolonne-middels"><Normaltekst>{kandidatliste.kandidater.length}</Normaltekst></div>
        <div className="kolonne-bred">{`${kandidatliste.opprettetAv.navn} (${kandidatliste.opprettetAv.ident})`}</div>
    </div>
);

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalstatus: MODALVISING.INGEN_MODAL,
            visSuccessMelding: false
        };
    }

    componentDidMount() {
        this.props.hentKandidatlister();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lagreStatus === LAGRE_STATUS.LOADING && this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            this.props.hentKandidatlister();
            this.visSuccessMelding();
            this.onLukkModalClick();
            this.props.resetLagreStatus();
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

    onLukkModalClick = () => {
        this.setState({
            modalstatus: MODALVISING.INGEN_MODAL
        });
    };

    visSuccessMelding = () => {
        this.setState({ visSuccessMelding: true });
        this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
    };

    skjulSuccessMelding = () => {
        this.setState({ visSuccessMelding: false });
    };

    render() {
        const { kandidatlister, fetchingKandidatlister, opprettetTittel } = this.props;
        return (
            <div>
                {this.state.modalstatus === MODALVISING.OPPRETT_MODAL && <OpprettModal onAvbrytClick={this.onLukkModalClick} />}
                <HjelpetekstFading
                    id="kandidatliste-lagret-melding"
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={`Kandidatliste "${opprettetTittel}" opprettet`}
                />
                <div className="Kandidatlister">
                    <SideHeader opprettListe={this.onOpprettClick} />
                    <div className="kandidatlister-table__wrapper">
                        <Systemtittel className="antall-kandidatlister">{`${kandidatlister.length} kandidatlister`}</Systemtittel>
                        <div className="kandidatlister-table">
                            <ListeHeader />
                            <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.egneKandidatlister.liste,
    fetchingKandidatlister: state.kandidatlister.hentListerStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => dispatch({ type: HENT_KANDIDATLISTER }),
    resetLagreStatus: () => dispatch({ type: RESET_LAGRE_STATUS })
});

export const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    opprettetAv: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string
    }).isRequired
});

SideHeader.propTypes = {
    opprettListe: PropTypes.func.isRequired
};

KandidatlisteRad.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined
};

Kandidatlister.propTypes = {
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.string.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    opprettetTittel: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
