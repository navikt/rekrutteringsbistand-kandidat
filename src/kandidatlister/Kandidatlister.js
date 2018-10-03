import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Sidetittel, Undertittel, Element, Undertekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import HjelpetekstFading from '../common/HjelpetekstFading';
import EditIkon from '../common/ikoner/EditIkon';
import SlettIkon from '../common/ikoner/SlettIkon';
import TomListe from './TomListe';
import { HENT_KANDIDATLISTER, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';
import './kandidatlister.less';
import PageHeader from '../common/PageHeaderWrapper';
import UnderArbeidSide from './UnderArbeidSide';

const Kandidatlistevisning = ({ fetching, kandidatlister }) => {
    if (fetching || kandidatlister === undefined) {
        return <NavFrontendSpinner type="L" />;
    } else if (kandidatlister.length === 0) {
        return (
            <TomListe
                lenke="/pam-kandidatsok/lister/opprett"
                lenkeTekst="Opprett kandidatliste"
            >
                Du har ingen kandidatlister
            </TomListe>);
    }

    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} />
        ))
    );
};

const IkonKnapp = ({ Ikon, tekst, onClick }) => (
    <button onClick={onClick} className="ikon-knapp">
        <Ikon className="ikon" />
        {tekst}
    </button>
);

const formaterDato = (datoStreng) => {
    const dato = new Date(datoStreng);
    return dato.toLocaleDateString('no-nb').replace(/\//g, '.');
};

const KandidatlisteRad = ({ kandidatliste }) => (
    <div className="Kandidatliste__panel">
        <div className="beskrivelse">
            <div className="topp">
                <div>
                    <Link to={`/pam-kandidatsok/lister/detaljer/${kandidatliste.kandidatlisteId}`} className="lenke" >
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
            <IkonKnapp Ikon={EditIkon} tekst="Endre" onClick={() => { console.log('endre'); }} />
            <IkonKnapp Ikon={SlettIkon} tekst="Slett" onClick={() => { console.log('slett'); }} />
        </div>
    </div>
);

const Header = ({ antallKandidater }) => (
    <PageHeader>
        <div className="Kandidatlister__header--innhold">
            <Sidetittel>Kandidatlister {antallKandidater > 0 && `(${antallKandidater})`}</Sidetittel>
            <Link to="/pam-kandidatsok/lister/opprett">
                <Knapp role="link" type="standard" className="knapp">Opprett ny</Knapp>
            </Link>
        </div>
    </PageHeader>
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

    componentDidUpdate(prevProps) {
        if (this.props.valgtArbeidsgiverId !== prevProps.valgtArbeidsgiverId) {
            this.props.hentKandidatlister();
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
        // TODO: Fjern featureToggle
        const { kandidatlister, fetchingKandidatlister, skalViseKandidatlister } = this.props;
        if (!skalViseKandidatlister) {
            return <UnderArbeidSide />;
        }
        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={this.props.opprettetTittel ? `Kandidatliste "${this.props.opprettetTittel}" opprettet` : 'Kandidatliste opprettet'}
                />
                <Header antallKandidater={kandidatlister !== undefined ? kandidatlister.length : 0} />
                <Container className="blokk-s container">
                    <Container className="Kandidatlister__container Kandidatlister__container-width">
                        <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} />
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
