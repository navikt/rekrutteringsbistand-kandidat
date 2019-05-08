import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Checkbox } from 'nav-frontend-skjema';
import { Container } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertekst, UndertekstBold } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'pam-frontend-knapper';
import TilbakeLenke from '../common/TilbakeLenke';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import PageHeader from '../../felles/common/PageHeaderWrapper';
import TomListe from '../../felles/kandidatlister/TomListe';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import { CLEAR_KANDIDATLISTE, HENT_KANDIDATLISTE, SLETT_KANDIDATER, SLETT_KANDIDATER_RESET_STATUS } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../../felles/konstanter';

import './kandidatlister.less';
import '../../felles/common/ikoner/ikoner.less';
import SlettKandidaterModal from '../common/SlettKandidaterModal';
import { capitalizeFirstLetter } from '../../felles/sok/utils';
import Sidetittel from '../../felles/common/Sidetittel';

const fornavnOgEtternavnFraKandidat = (kandidat) => (kandidat.fornavn && kandidat.etternavn
    ? `${capitalizeFirstLetter(kandidat.fornavn)} ${capitalizeFirstLetter(kandidat.etternavn)}`
    : kandidat.kandidatnr);

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerAlleChecked: false,
            kandidater: [],
            sletterKandidater: false,
            visSlettKandidaterModal: false,
            visSlettKandidaterFeilmelding: false,
            visSlettSuccessMelding: false,
            antallSlettedeKandidater: 0
        };
    }

    componentDidMount() {
        this.mounted = true;
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
        } else if (props.sletteStatus === SLETTE_STATUS.SUCCESS && !state.sletterKandidater) {
            // kommer tilbake med slett success fra cv-visning
            return {
                ...state,
                visSlettSuccessMelding: true
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.visSlettSuccessMelding) {
            this.skjulSuccessMeldingTimeoutHandle = setTimeout(this.skjulSlettSuccessMelding, 3000);
            this.props.nullstillSletteStatus();
        } else if (this.props.sletteStatus !== SLETTE_STATUS.SUCCESS) {
            clearTimeout(this.skjulSuccessMeldingTimeoutHandle);
        }
        if (prevState.kandidater !== this.state.kandidater) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                markerAlleChecked: this.state.kandidater.filter((k) => !k.checked).length === 0
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.props.clearKandidatliste();
        clearTimeout(this.skjulSuccessMeldingTimeoutHandle);
    }

    onKandidatCheckboxClicked = (valgtKandidat) => {
        this.setState({
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
    };

    onFjernKandidat = (kandidat) => {
        const enkelKandidatIListe = [kandidat];
        this.props.slettKandidater(this.props.kandidatlisteId, enkelKandidatIListe);
    };

    markerAlleClicked = () => {
        this.setState({
            markerAlleChecked: !this.state.markerAlleChecked,
            kandidater: this.state.kandidater.map((k) => ({ ...k, checked: !this.state.markerAlleChecked }))
        });
    };

    slettMarkerteKandidater = () => {
        const { kandidatlisteId } = this.props;
        const kandidater = this.state.kandidater.filter((k) => k.checked);

        if (this.state.sletterKandidater) {
            return;
        }

        if (kandidatlisteId && kandidater.length > 0) {
            this.props.slettKandidater(this.props.kandidatlisteId, kandidater);
            this.setState({ sletterKandidater: true, antallSlettedeKandidater: kandidater.length });
        }
    };

    visSlettKandidaterModal = () => {
        this.setState({ visSlettKandidaterModal: true });
    };

    lukkSlettModal = () => {
        this.setState({ visSlettKandidaterModal: false, visSlettKandidaterFeilmelding: false, sletterKandidater: false });
    };

    skjulSlettSuccessMelding = () => {
        if (this.mounted) {
            this.setState({ visSlettSuccessMelding: false });
        }
    };

    visSlettKandidaterFeilmelding = () => {
        this.setState({ visSlettKandidaterFeilmelding: true });
    };

    render() {
        if (this.props.kandidatliste === undefined
            || this.props.kandidatliste.kandidater === undefined) {
            return (
                <div className="KandidatlisteDetalj__spinner--wrapper">
                    <NavFrontendSpinner />
                </div>
            );
        }

        const { markerAlleChecked, kandidater, visSlettKandidaterFeilmelding, visSlettKandidaterModal, visSlettSuccessMelding, antallSlettedeKandidater } = this.state;
        const { tittel, beskrivelse, oppdragsgiver } = this.props.kandidatliste;
        const valgteKandidater = kandidater.filter((k) => k.checked);

        const Header = () => (
            <PageHeader>
                <div className="KandidatlisteDetalj__header">
                    <div className="top-row">
                        <div className="TilbakeLenke-wrapper">
                            <TilbakeLenke tekst="Til&nbsp;kandidatlistene" href={`/${CONTEXT_ROOT}/lister`} />
                        </div>
                        <div className="info-kolonne">
                            <Sidetittel id="kandidatliste-navn" className="tittel">{tittel}</Sidetittel>
                            {beskrivelse && <Undertekst id="kandidatliste-beskrivelse" className="undertittel">{beskrivelse}</Undertekst>}
                        </div>
                        <div className="empty-right-side" />
                    </div>
                    <div className="bottom-row">
                        <div className="inforad">
                            <Normaltekst id="kandidatliste-antall-kandidater">{kandidater.length !== 1 ? `${kandidater.length} kandidater` : '1 kandidat'}</Normaltekst>
                            {oppdragsgiver && <Normaltekst id="kandidatliste-oppdragsgiver">Oppdragsgiver: {oppdragsgiver}</Normaltekst>}
                        </div>
                    </div>
                </div>
            </PageHeader>
        );

        const DisabledSlettKnapp = () => (
            <div className="Lenkeknapp typo-normal Delete" aria-label="Knapp for sletting av markerte kandidater fra listen">
                Slett
                <i className="Delete__icon" />
            </div>
        );

        const Knapper = () => {
            const { kandidatlisteId } = this.props;

            if (kandidatlisteId && valgteKandidater.length > 0) {
                return (
                    <div className="KandidatlisteDetalj__knapperad">
                        <div className="KandidatlisteDetalj__knapperad--slett" aria-label="Knapp for sletting av markerte kandidater fra listen">
                            <Lenkeknapp onClick={this.visSlettKandidaterModal} className="Delete">
                                Slett
                                <i className="Delete__icon" />
                            </Lenkeknapp>
                        </div>
                    </div>
                );
            }
            return (
                <div className="KandidatlisteDetalj__knapperad">
                    <div className="KandidatlisteDetalj__knapperad--slett">
                        <HjelpetekstMidt
                            id="marker-kandidater-hjelpetekst"
                            anchor={DisabledSlettKnapp}
                            tittel="Slett markerte kandidater"
                        >
                            Du må huke av for kandidatene du ønsker å slette
                        </HjelpetekstMidt>
                    </div>
                </div>
            );
        };

        const KandidatListeToppRad = () => (
            <div className="thead">
                <div className="KandidatlisteDetalj__panel KandidatlisteDetalj__panel--header th">
                    <div className="KandidatlisteDetalj__panel--first td">
                        <Checkbox
                            className="skjemaelement--pink"
                            id="marker-alle-kandidater-checkbox"
                            title="Marker alle"
                            label="Navn"
                            aria-label="Marker alle kandidater"
                            checked={markerAlleChecked}
                            onChange={this.markerAlleClicked}
                        />
                    </div>
                    <UndertekstBold className="td">Arbeidserfaring</UndertekstBold>
                </div>
            </div>
        );

        const SynligKandidatPanel = (kandidat) => (
            <div className="KandidatlisteDetalj__panel tr" key={JSON.stringify(kandidat)}>
                <div className="KandidatlisteDetalj__panel--first td">
                    <div className="skjemaelement skjemaelement--horisontal text-hide skjemaelement--pink">
                        <input
                            type="checkbox"
                            title="Marker"
                            id={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                            className="skjemaelement__input checkboks"
                            aria-label={`Marker kandidat ${fornavnOgEtternavnFraKandidat(kandidat)}`}
                            checked={kandidat.checked}
                            onChange={() => this.onKandidatCheckboxClicked(kandidat)}
                        />
                        <label
                            className="skjemaelement__label"
                            htmlFor={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                            aria-hidden="true"
                        >
                            .
                        </label>
                    </div>
                    <Link title="Vis profil" className="link" to={`/${CONTEXT_ROOT}/lister/detaljer/${this.props.kandidatlisteId}/cv?kandidatNr=${kandidat.kandidatnr}`}>
                        {fornavnOgEtternavnFraKandidat(kandidat)}
                    </Link>
                </div>
                <Normaltekst>{kandidat.sisteArbeidserfaring}</Normaltekst>
            </div>
        );

        const IkkeSynligKandidatPanel = (kandidat) => (
            <div className="KandidatlisteDetalj__panel__ikke_synlig tr" key={JSON.stringify(kandidat)}>
                <div className="KandidatlisteDetalj__panel--first td" >
                    <div className="text-hide">
                        <input
                            type="checkbox"
                            id={`marker-kandidat-checkbox-disabled-${kandidat.kandidatnr}`}
                            className="skjemaelement__input checkboks"
                            aria-label="Kandidat ikke synlig"
                            disabled
                        />
                        <label
                            className="skjemaelement__label"
                            htmlFor={`marker-kandidat-checkbox-disabled-${kandidat.kandidatnr}`}
                            aria-hidden="true"
                        >
                            .
                        </label>
                    </div>
                    <Normaltekst>
                        Kandidaten er inaktiv og ikke aktuell for jobb
                    </Normaltekst>
                </div>
                <Knapp
                    className="knapp--fjern-kandidat"
                    mini
                    onClick={() => this.onFjernKandidat(kandidat)}
                >
                    Fjern kandidat
                </Knapp>
            </div>
        );

        const erSynligFlaggIkkeSatt = (kandidat) => kandidat.erSynlig === undefined || kandidat.erSynlig === null;

        const KandidatListe = () => (
            <div className="tbody">
                {kandidater && kandidater.map((kandidat) => {
                    if (erSynligFlaggIkkeSatt(kandidat) || kandidat.erSynlig) {
                        return (
                            SynligKandidatPanel(kandidat)
                        );
                    }
                    return IkkeSynligKandidatPanel(kandidat);
                })}
            </div>
        );

        return (
            <div id="KandidaterDetalj">
                <Header />
                <HjelpetekstFading
                    synlig={visSlettSuccessMelding}
                    type="suksess"
                    tekst={antallSlettedeKandidater > 1 ? `${antallSlettedeKandidater} kandidater er slettet` : 'Kandidaten er slettet'}
                />
                {kandidater.length > 0 ? (
                    <div className="KandidatlisteDetalj__container Kandidatlister__container-width-l">
                        <Knapper />
                        <div className="table">
                            <KandidatListeToppRad />
                            <KandidatListe />
                        </div>
                    </div>

                ) : (
                    <Container className="Kandidatlister__container Kandidatlister__container-width">
                        <TomListe lenke={`/${CONTEXT_ROOT}`} lenkeTekst="Finn kandidater">
                            Du har ingen kandidater i kandidatlisten
                        </TomListe>
                    </Container>
                )}
                <SlettKandidaterModal
                    isOpen={visSlettKandidaterModal}
                    sletterKandidater={this.props.sletteStatus === SLETTE_STATUS.LOADING}
                    lukkModal={this.lukkSlettModal}
                    visFeilmelding={visSlettKandidaterFeilmelding}
                    valgteKandidater={valgteKandidater}
                    onDeleteClick={this.slettMarkerteKandidater}
                />
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
                sisteArbeidserfaring: PropTypes.string,
                fornavn: PropTypes.string,
                etternavn: PropTypes.string,
                erSynlig: PropTypes.bool.isRequired
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
