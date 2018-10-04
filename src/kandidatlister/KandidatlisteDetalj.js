import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Panel } from 'nav-frontend-paneler';
import { Checkbox } from 'nav-frontend-skjema';
import { Container } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertekst, UndertekstBold, Sidetittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import TilbakeLenke from '../common/TilbakeLenke';
import SlettIkon from '../common/ikoner/SlettIkon';
import HjelpetekstFading from '../common/HjelpetekstFading';
import PageHeader from '../common/PageHeaderWrapper';
import TomListe from './TomListe';
import { HENT_KANDIDATLISTE, SLETT_KANDIDATER, CLEAR_KANDIDATLISTE, SLETT_KANDIDATER_RESET_STATUS } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../konstanter';

import './kandidatlister.less';

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerAlleChecked: false,
            kandidater: [],
            sletterKandidater: false,
            visSlettKandidaterModal: false,
            visSlettKandidaterFeilmelding: false,
            visSlettSuccessMelding: false
        };
    }

    componentDidMount() {
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.kandidatliste !== undefined &&
            state.kandidater.length !== props.kandidatliste.kandidater.length) {
            return {
                ...state,
                kandidater: props.kandidatliste.kandidater.map((k) => ({ ...k, checked: false })),
                visSlettKandidaterFeilmelding: false,
                visSlettKandidaterModal: false,
                sletterKandidater: false,
                visSlettSuccessMelding: props.sletteStatus === SLETTE_STATUS.SUCCESS
            };
        } else if (state.sletterKandidater) {
            const visSlettKandidaterModal = (
                state.sletterKandidater &&
                props.sletteStatus !== SLETTE_STATUS.SUCCESS
            );

            const visSlettKandidaterFeilmelding = (
                state.sletterKandidater &&
                props.sletteStatus === SLETTE_STATUS.FAILURE
            );

            return {
                ...state,
                kandidater: props.kandidatliste.kandidater.map((k) => ({ ...k, checked: false })),
                visSlettKandidaterModal,
                visSlettKandidaterFeilmelding,
                sletterKandidater: false,
                visSlettSuccessMelding: props.sletteStatus === SLETTE_STATUS.SUCCESS
            };
        }

        return null;
    }

    componentDidUpdate() {
        if (this.state.visSlettSuccessMelding) {
            this.skjulSuccessMeldingTimeout = setTimeout(this.skjulSlettSuccessMelding, 3000);
        } else if (this.skjulSuccessMeldingTimeout !== undefined && this.props.sletteStatus !== SLETTE_STATUS.SUCCESS) {
            clearTimeout(this.skjulSuccessMeldingTimeout);
        }
    }

    componentWillUnmount() {
        this.props.clearKandidatliste();
        clearTimeout(this.skjulSuccessMeldingTimeout);
    }

    onKandidatCheckboxClicked = (valgtKandidat) => {
        this.setState({
            markerAlleChecked: false,
            kandidater: this.state.kandidater.map((k) => {
                if (k.kandidatnr === valgtKandidat.kandidatnr) {
                    return {
                        ...k,
                        checked: !k.checked
                    };
                }
                return { ...k };
            })
        });
    }

    skjulSuccessMeldingTimeout = undefined;

    visSlettKandidaterFeilmelding = () => {
        this.setState({ visSlettKandidaterFeilmelding: true });
    }

    markerAlleClicked = () => {
        this.setState({
            markerAlleChecked: !this.state.markerAlleChecked,
            kandidater: this.state.kandidater.map((k) => ({ ...k, checked: !this.state.markerAlleChecked }))
        });
    }

    slettMarkerteKandidaterClicked = () => {
        const { kandidatlisteId } = this.props;
        const kandidater = this.state.kandidater.filter((k) => k.checked);

        if (kandidatlisteId && kandidater.length > 0) {
            this.visSlettKandidaterModal();
        }
    }

    slettMarkerteKandidater = () => {
        const { kandidatlisteId } = this.props;
        const kandidater = this.state.kandidater.filter((k) => k.checked);

        if (this.state.sletterKandidater) {
            return;
        }

        if (kandidatlisteId && kandidater.length > 0) {
            this.props.slettKandidater(this.props.kandidatlisteId, kandidater);
            this.setState({ sletterKandidater: true });
        }
    }

    visSlettKandidaterModal = () => {
        this.setState({ visSlettKandidaterModal: true });
    }

    lukkSlettModal = () => {
        this.setState({ visSlettKandidaterModal: false, visSlettKandidaterFeilmelding: false, sletterKandidater: false });
    }

    skjulSlettSuccessMelding = () => {
        this.setState({ visSlettSuccessMelding: false });
        this.props.nullstillSletteStatus();
        clearTimeout(this.skjulSuccessMeldingTimeout);
    }

    render() {
        if (this.props.kandidatliste === undefined
            || this.props.kandidatliste.kandidater === undefined) {
            return (
                <div className="KandidatlisteDetalj__spinner--wrapper">
                    <NavFrontendSpinner />
                </div>
            );
        }

        const { markerAlleChecked, kandidater, visSlettKandidaterFeilmelding, visSlettKandidaterModal } = this.state;
        const { tittel, beskrivelse, oppdragsgiver } = this.props.kandidatliste;
        const valgteKandidater = kandidater.filter((k) => k.checked);

        const Header = () => (
            <PageHeader>
                <div className="KandidatlisteDetalj__header--innhold">
                    <TilbakeLenke tekst="Til kandidatlistene" href="/pam-kandidatsok/lister" />
                    <Sidetittel>{tittel}</Sidetittel>
                    <Undertekst className="undertittel">{beskrivelse}</Undertekst>
                    <div className="inforad">
                        <Normaltekst>{kandidater.length} kandidater</Normaltekst>
                        <Normaltekst>Oppdragsgiver: {oppdragsgiver}</Normaltekst>
                    </div>
                </div>
            </PageHeader>
        );

        const SlettKnapp = () => (
            <div
                role="button"
                tabIndex="0"
                className="knapp--ikon"
                onKeyPress={this.slettMarkerteKandidaterClicked}
                onClick={this.slettMarkerteKandidaterClicked}
            >
                <SlettIkon id="slett-knapp" fargeKode="#000" />
                <Normaltekst>Slett</Normaltekst>
            </div>
        );

        const Knapper = () => (
            <div className="KandidatlisteDetalj__knapperad">
                {/* <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={() => {}}
                    onClick={() => {}}
                >
                    <PrinterIkon />
                    <Normaltekst>Skriv ut</Normaltekst>
                </div> */}
                <div className="KandidatlisteDetalj__knapperad--slett">
                    <HjelpetekstMidt
                        className="hjelpetekst--slett"
                        id="marker-kandidater-hjelpetekst"
                        anchor={SlettKnapp}
                    >
                            Du må huke av for kandidatene du ønsker å slette
                    </HjelpetekstMidt>
                </div>
            </div>
        );

        const KandidatListeToppRad = () => (
            <Panel className="KandidatlisteDetalj__panel KandidatlisteDetalj__panel--header">
                <div className="KandidatlisteDetalj__panel--first">
                    <Checkbox label="Navn" checked={markerAlleChecked} onChange={this.markerAlleClicked} />
                </div>
                <UndertekstBold>Arbeidserfaring</UndertekstBold>
            </Panel>
        );

        const KandidatListe = () => (
            kandidater && kandidater.map((kandidat) => (
                <Panel className="KandidatlisteDetalj__panel" key={JSON.stringify(kandidat)}>
                    <div className="KandidatlisteDetalj__panel--first">
                        <Checkbox className="text-hide" label="." checked={kandidat.checked} onChange={() => this.onKandidatCheckboxClicked(kandidat)} />
                        <Link className="lenke" to={`/pam-kandidatsok/lister/detaljer/${this.props.kandidatlisteId}/cv?kandidatNr=${kandidat.kandidatnr}`}>{kandidat.kandidatnr}</Link>
                    </div>
                    <Normaltekst >{kandidat.sisteArbeidserfaring}</Normaltekst>
                </Panel>
            ))
        );

        const SlettKandidaterModal = () => (
            <Modal
                className="KandidatlisteDetalj__modal"
                isOpen={visSlettKandidaterModal}
                onRequestClose={() => {
                    if (!this.state.sletterKandidater) {
                        this.lukkSlettModal();
                    }
                }}
                closeButton
                contentLabel={valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}
            >
                {visSlettKandidaterFeilmelding && (
                    <AlertStripeAdvarsel className="feilmleding">Noe gikk galt under sletting av kandidater</AlertStripeAdvarsel>
                )}
                <Sidetittel className="overskrift">{valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}</Sidetittel>
                <Normaltekst>{valgteKandidater.length === 1
                    ? `Er du sikker på at du ønsker å slette ${valgteKandidater.pop().kandidatnr} fra listen?`
                    : 'Er du sikker på at du ønsker å slette kandidatene fra listen?'
                }
                </Normaltekst>
                <div className="knapperad">
                    <Hovedknapp onClick={this.slettMarkerteKandidater}>Slett</Hovedknapp>
                    <Flatknapp onClick={this.lukkSlettModal} disabled={this.state.sletterKandidater} >Avbryt</Flatknapp>
                </div>
            </Modal>
        );

        return (
            <div id="KandidaterDetalj">
                <Header />
                <HjelpetekstFading
                    synlig={this.state.visSlettSuccessMelding}
                    type="suksess"
                    tekst={'Kandidaten er slettet'}
                />
                {kandidater.length > 0 ? (
                    <div className="KandidatlisteDetalj__container Kandidatlister__container-width-l">
                        <Knapper />
                        <KandidatListeToppRad />
                        <KandidatListe />
                    </div>

                ) : (
                    <Container className="Kandidatlister__container Kandidatlister__container-width">
                        <TomListe lenke="/pam-kandidatsok" lenkeTekst="Finn kandidater">
                            Du har ingen kandidater i kandidatlisten
                        </TomListe>
                    </Container>
                )}
                <SlettKandidaterModal />
            </div>
        );
    }
}

KandidatlisteDetalj.defaultProps = {
    kandidatliste: undefined
};


KandidatlisteDetalj.propTypes = {
    kandidatlisteId: PropTypes.string.isRequired,
    kandidatliste: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        organisasjonNavn: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                lagtTilAv: PropTypes.string,
                kandidatnr: PropTypes.string,
                sisteArbeidserfaring: PropTypes.string
            })
        )
    }),
    sletteStatus: PropTypes.string.isRequired,
    hentKandidatliste: PropTypes.func.isRequired,
    slettKandidater: PropTypes.func.isRequired,
    clearKandidatliste: PropTypes.func.isRequired,
    nullstillSletteStatus: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
    ...props,
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    sletteStatus: state.kandidatlister.detaljer.sletteStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => dispatch({ type: HENT_KANDIDATLISTE, kandidatlisteId }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater }),
    clearKandidatliste: () => dispatch({ type: CLEAR_KANDIDATLISTE }),
    nullstillSletteStatus: () => dispatch({ type: SLETT_KANDIDATER_RESET_STATUS })
});

Modal.setAppElement('#app');

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetalj);
