import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Panel } from 'nav-frontend-paneler';
import { Checkbox } from 'nav-frontend-skjema';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertekst, UndertekstBold, Sidetittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import TilbakeLenke from '../common/TilbakeLenke';
import SlettIkon from '../common/ikoner/SlettIkon';
import PrinterIkon from '../common/ikoner/PrinterIkon';
import { HENT_KANDIDATLISTE, SLETT_KANDIDATER, CLEAR_KANDIDATLISTE } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../konstanter';

import './kandidatlister.less';

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerAlleChecked: false,
            kandidater: [],
            visSlettKandidaterModal: false,
            visSlettKandidaterFeilmelding: false
        };
    }

    componentWillMount() {
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.kandidatliste) {
            this.setState({
                markerAlleChecked: false,
                kandidater: nextProps.kandidatliste.kandidater.map((k) => ({ ...k, checked: false }))
            });

            if (!this.props.kandidatliste) {
                return;
            }

            if (this.props.kandidatliste.sletteStatus === SLETTE_STATUS.LOADING
                && nextProps.kandidatliste.sletteStatus !== SLETTE_STATUS.FAILURE) {
                this.lukkSlettModal();
            } else if (this.props.kandidatliste.sletteStatus !== SLETTE_STATUS.FAILURE &&
                nextProps.kandidatliste.sletteStatus === SLETTE_STATUS.FAILURE) {
                this.visSlettKandidaterFeilmelding();
            }
        }
    }

    componentWillUnmount() {
        this.props.clearKandidatliste();
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
        if (kandidatlisteId && kandidater.length > 0) {
            this.props.slettKandidater(this.props.kandidatlisteId, kandidater);
        }
    }

    visSlettKandidaterModal = () => {
        this.setState({ visSlettKandidaterModal: true });
    }

    lukkSlettModal = () => {
        this.setState({ visSlettKandidaterModal: false, visSlettKandidaterFeilmelding: false });
    }

    render() {
        if (this.props.kandidatliste === undefined
            || this.props.kandidatliste.kandidater === undefined) {
            return (
                <NavFrontendSpinner />
            );
        }

        const { markerAlleChecked, kandidater, visSlettKandidaterFeilmelding, visSlettKandidaterModal } = this.state;
        const { tittel, beskrivelse, organisasjonNavn } = this.props.kandidatliste;
        const valgteKandidater = kandidater.filter((k) => k.checked);

        const ToppRad = () => (
            <Panel className="KandidatlisteDetalj__panel KandidatlisteDetalj__panel--header">
                <div className="KandidatlisteDetalj__panel--venstre">
                    <Checkbox label="Navn" checked={markerAlleChecked} onChange={this.markerAlleClicked} />
                </div>
                <UndertekstBold>Arbeidserfaring</UndertekstBold>
            </Panel>
        );

        const KandidatListe = () => (
            kandidater && kandidater.map((kandidat) => (
                <Panel className="KandidatlisteDetalj__panel" key={JSON.stringify(kandidat)}>
                    <div className="KandidatlisteDetalj__panel--venstre">
                        <Checkbox className="text-hide" label="." checked={kandidat.checked} onChange={() => this.onKandidatCheckboxClicked(kandidat)} />
                        <Link to={`/pam-kandidatsok/cv?kandidatNr=${kandidat.kandidatnr}`}>{kandidat.kandidatnr}</Link>
                    </div>
                    <Undertekst >{kandidat.sisteArbeidserfaring}</Undertekst>
                </Panel>
            ))
        );

        const Header = () => (
            <div className="KandidatlisteHeader">
                <div className="KandidatlisteDetalj__header--innhold">
                    <TilbakeLenke tekst="Til kandidatlistene" href="/pam-kandidatsok/lister" />
                    <Sidetittel>{tittel}</Sidetittel>
                    <Undertekst className="undertittel">{beskrivelse || ''}</Undertekst>
                    <div className="inforad">
                        <Normaltekst>{kandidater.length} kandidater</Normaltekst>
                        <Normaltekst>Oppdragsgiver: <Link to="#">{organisasjonNavn}</Link></Normaltekst>
                    </div>
                </div>
            </div>
        );

        const Knapper = () => (
            <div className="KandidatlisteDetalj__knapperad">
                <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={() => {}}
                    onClick={() => {}}
                >
                    <PrinterIkon />
                    <Normaltekst>Skriv ut</Normaltekst>
                </div>
                <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={this.slettMarkerteKandidaterClicked}
                    onClick={this.slettMarkerteKandidaterClicked}
                >
                    <SlettIkon fargeKode="#000" />
                    <Normaltekst>Slett</Normaltekst>
                </div>
            </div>
        );


        const SlettKandidaterModal = () => (
            <Modal
                className="KandidatlisteDetalj__modal"
                isOpen={visSlettKandidaterModal}
                onRequestClose={this.lukkSlettModal}
                closeButton
                contentLabel="Slett kandidater"
            >
                {visSlettKandidaterFeilmelding && (
                    <AlertStripeAdvarsel className="feilmleding">Noe gikk galt under sletting av kandidater</AlertStripeAdvarsel>
                )}
                <Sidetittel>Slett kandidatene</Sidetittel>
                <br />
                <Normaltekst>{valgteKandidater.length === 1
                    ? `Er du sikker på at du ønsker å slette ${valgteKandidater.pop().kandidatnr}?`
                    : 'Er du sikker på at du ønsker å slette kandidatene?'
                }
                </Normaltekst>
                <div className="knapperad">
                    <Hovedknapp onClick={this.slettMarkerteKandidater}>Slett</Hovedknapp>
                    <Flatknapp onClick={this.lukkSlettModal}>Tilbake til kandidatlisten</Flatknapp>
                </div>
            </Modal>
        );

        return (
            <div id="KandidaterDetalj">
                <Header />
                <div className="KandidatlisteDetalj__container">
                    <Knapper />
                    <ToppRad />
                    <KandidatListe />
                </div>
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
        sletteStatus: PropTypes.string,
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        organisasjonNavn: PropTypes.string,
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                lagtTilAv: PropTypes.string,
                kandidatnr: PropTypes.string,
                sisteArbeidserfaring: PropTypes.string
            })
        )
    }),
    hentKandidatliste: PropTypes.func.isRequired,
    slettKandidater: PropTypes.func.isRequired,
    clearKandidatliste: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
    ...props,
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlister.detaljer
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => dispatch({ type: HENT_KANDIDATLISTE, kandidatlisteId }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater }),
    clearKandidatliste: () => dispatch({ type: CLEAR_KANDIDATLISTE })
});

Modal.setAppElement('#app');

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetalj);
