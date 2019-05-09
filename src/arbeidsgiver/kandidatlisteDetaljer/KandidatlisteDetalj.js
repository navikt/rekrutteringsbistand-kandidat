import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Checkbox } from 'nav-frontend-skjema';
import { Container } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel, Undertekst, UndertekstBold } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Knapp } from 'pam-frontend-knapper';
import TilbakeLenke from '../common/TilbakeLenke';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import PageHeader from '../../felles/common/PageHeaderWrapper';
import TomListe from '../../felles/kandidatlister/TomListe';
import Notater from './Notater.tsx';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import { KandidatlisteTypes, UpdateKandidatIListeStateTypes, KandidatState } from './kandidatlisteReducer.ts';
import { SLETTE_STATUS } from '../../felles/konstanter';

import '../kandidatlister/kandidatlister.less';
import '../../felles/common/ikoner/ikoner.less';
import SlettKandidaterModal from '../common/SlettKandidaterModal';
import { capitalizeFirstLetter } from '../../felles/sok/utils';

const fornavnOgEtternavnFraKandidat = (kandidat) => (kandidat.fornavn && kandidat.etternavn
    ? `${capitalizeFirstLetter(kandidat.fornavn)} ${capitalizeFirstLetter(kandidat.etternavn)}`
    : kandidat.kandidatnr);

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sletterKandidater: false,
            visSlettKandidaterModal: false,
            visSlettKandidaterFeilmelding: false,
            visSlettSuccessMelding: false,
            antallSlettedeKandidater: 0
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.sletterKandidater) {
            const visSlettKandidaterModal = props.sletteStatus !== SLETTE_STATUS.SUCCESS;
            const visSlettKandidaterFeilmelding = props.sletteStatus === SLETTE_STATUS.FAILURE;

            return {
                ...state,
                visSlettKandidaterModal,
                visSlettKandidaterFeilmelding,
                sletterKandidater: props.sletteStatus !== SLETTE_STATUS.SUCCESS,
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
            if (this.state.visSlettSuccessMelding !== prevState.visSlettSuccessMelding) {
                this.skjulSuccessMeldingTimeoutHandle = setTimeout(this.skjulSlettSuccessMelding, 3000);
                this.props.nullstillSletteStatus();
            }
        } else if (this.props.sletteStatus !== SLETTE_STATUS.SUCCESS) {
            clearTimeout(this.skjulSuccessMeldingTimeoutHandle);
        }
    }

    componentWillUnmount() {
        this.props.clearKandidatliste();
        clearTimeout(this.skjulSuccessMeldingTimeoutHandle);
    }

    onFjernKandidat = (kandidat) => {
        const enkelKandidatIListe = [kandidat];
        this.props.slettKandidater(this.props.kandidatliste.kandidatlisteId, enkelKandidatIListe);
    };

    slettMarkerteKandidater = () => {
        const { kandidatlisteId, kandidater } = this.props.kandidatliste;
        const markerteKandidater = kandidater.filter((k) => k.checked);
        if (this.state.sletterKandidater) {
            return;
        }

        if (kandidatlisteId && markerteKandidater.length > 0) {
            this.props.slettKandidater(kandidatlisteId, markerteKandidater);
            this.setState({ sletterKandidater: true, antallSlettedeKandidater: markerteKandidater.length });
        }
    };

    visSlettKandidaterModal = () => {
        this.setState({ visSlettKandidaterModal: true });
    };

    lukkSlettModal = () => {
        this.setState({ visSlettKandidaterModal: false, visSlettKandidaterFeilmelding: false, sletterKandidater: false });
    };

    skjulSlettSuccessMelding = () => {
        this.setState({ visSlettSuccessMelding: false });
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

        const { visSlettKandidaterFeilmelding, visSlettKandidaterModal, visSlettSuccessMelding, antallSlettedeKandidater } = this.state;
        const { tittel, beskrivelse, oppdragsgiver, kandidater } = this.props.kandidatliste;
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
                <i className="Delete__icon" />
                Slett
            </div>
        );

        const Knapper = () => {
            const { kandidatlisteId } = this.props.kandidatliste;
            if (kandidatlisteId && valgteKandidater.length > 0) {
                return (
                    <div className="KandidatlisteDetalj__knapperad">
                        <div className="KandidatlisteDetalj__knapperad--slett" aria-label="Knapp for sletting av markerte kandidater fra listen">
                            <Lenkeknapp onClick={this.visSlettKandidaterModal} className="Delete">
                                <i className="Delete__icon" />
                                Slett
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
                            checked={this.props.kandidatliste.allChecked}
                            onChange={() => { this.props.markerAlleClicked(!this.props.kandidatliste.allChecked); }}
                        />
                    </div>
                    <UndertekstBold className="KandidatlisteDetalj__panel--second arbeidserfaring td">Arbeidserfaring</UndertekstBold>
                    <UndertekstBold className="KandidatlisteDetalj__panel--notater td">Notater</UndertekstBold>
                </div>
            </div>
        );

        const SynligKandidatPanel = ({ kandidat }) => (
            <div className="tr">
                <div className="KandidatlisteDetalj__panel">
                    <div className="KandidatlisteDetalj__panel--first td">
                        <div className="skjemaelement skjemaelement--horisontal text-hide skjemaelement--pink">
                            <input
                                type="checkbox"
                                title="Marker"
                                id={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                                className="skjemaelement__input checkboks"
                                aria-label={`Marker kandidat ${fornavnOgEtternavnFraKandidat(kandidat)}`}
                                checked={kandidat.checked}
                                onChange={() => this.props.toggleKandidatChecked(kandidat.kandidatnr)}
                            />
                            <label
                                className="skjemaelement__label"
                                htmlFor={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                                aria-hidden="true"
                            >
                                .
                            </label>
                        </div>
                        <Link title="Vis profil" className="link" to={`/${CONTEXT_ROOT}/lister/detaljer/${this.props.kandidatliste.kandidatlisteId}/cv?kandidatNr=${kandidat.kandidatnr}`}>
                            {fornavnOgEtternavnFraKandidat(kandidat)}
                        </Link>
                    </div>
                    <Normaltekst className="KandidatlisteDetalj__panel--second arbeidserfaring">{kandidat.sisteArbeidserfaring}</Normaltekst>
                    <div className="KandidatlisteDetalj__panel--notater">
                        <Lenkeknapp
                            onClick={() => {
                                this.props.setViewStateKandidat(
                                    kandidat.kandidatnr,
                                    kandidat.viewState === KandidatState.NOTATER_VISES ? KandidatState.LUKKET : KandidatState.NOTATER_VISES
                                );
                            }}
                            className="legg-til-kandidat Notat"
                        >
                            <i className="Notat__icon" />
                            {/* {antallNotater} */}
                            1
                            <NavFrontendChevron type={kandidat.viewState === KandidatState.NOTATER_VISES ? 'opp' : 'ned'} />
                        </Lenkeknapp>
                    </div>
                </div>

                <div className="KandidatlisteDetalj__panel">
                    <div className="KandidatlisteDetalj__panel--first td" />
                    <div className="KandidatlisteDetalj__panel--second td">
                        { kandidat.viewState === KandidatState.NOTATER_VISES &&
                            <Notater
                                notater={kandidat.notater}
                                kandidatlisteId={this.props.kandidatliste.kandidatlisteId}
                                kandidatnr={kandidat.kandidatnr}
                                antallNotater={kandidat.notater.notater.kind === RemoteDataTypes.SUCCESS ? kandidat.notater.notater.data.length : 1}
                            />
                        }
                    </div>
                    <div className="KandidatlisteDetalj__panel--notater" />
                </div>
            </div>
        );

        const IkkeSynligKandidatPanel = ({ kandidat }) => (
            <div className="KandidatlisteDetalj__panel__ikke_synlig tr">
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
                            <SynligKandidatPanel kandidat={kandidat} key={`${kandidat.kandidatnr}-synlig`} />
                        );
                    }
                    return <IkkeSynligKandidatPanel kandidat={kandidat} key={`${kandidat.kandidatnr}-ikke`} />;
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

KandidatlisteDetalj.propTypes = {
    kandidatliste: PropTypes.shape({
        tittel: PropTypes.string,
        kandidatlisteId: PropTypes.string,
        beskrivelse: PropTypes.string,
        organisasjonNavn: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        allChecked: PropTypes.bool,
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                lagtTilAv: PropTypes.string,
                kandidatnr: PropTypes.string,
                sisteArbeidserfaring: PropTypes.string,
                fornavn: PropTypes.string,
                etternavn: PropTypes.string,
                erSynlig: PropTypes.bool.isRequired,
                checked: PropTypes.bool
            })
        )
    }).isRequired,
    sletteStatus: PropTypes.string.isRequired,
    slettKandidater: PropTypes.func.isRequired,
    clearKandidatliste: PropTypes.func.isRequired,
    nullstillSletteStatus: PropTypes.func.isRequired,
    toggleKandidatChecked: PropTypes.func.isRequired,
    setViewStateKandidat: PropTypes.func.isRequired,
    markerAlleClicked: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
    ...props,
    sletteStatus: state.kandidatlisteDetaljer.sletteStatus
});

const mapDispatchToProps = (dispatch) => ({
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER, kandidatlisteId, kandidater }),
    clearKandidatliste: () => dispatch({ type: KandidatlisteTypes.CLEAR_KANDIDATLISTE }),
    nullstillSletteStatus: () => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS }),
    toggleKandidatChecked: (kandidatnr) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.KANDIDAT_TOGGLE_CHECKED, kandidatnr } }),
    setViewStateKandidat: (kandidatnr, state) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.KANDIDAT_SET_VIEW_STATE, kandidatnr, state } }),
    markerAlleClicked: (checked) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.SET_ALL_CHECKED, checked } })
});

Modal.setAppElement('#app');

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetalj);
