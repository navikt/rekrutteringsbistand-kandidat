import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { HjelpetekstVenstre } from 'nav-frontend-hjelpetekst';
import NavFrontendChevron from 'nav-frontend-chevron';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SET_STATE } from '../sok/searchReducer';
import EndreModal from './modaler/EndreModal';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import MarkerSomMinModal from './modaler/MarkerSomMinModal';
import OpprettModal from './modaler/OpprettModal';
import SlettKandidatlisteModal from './modaler/SlettKandidatlisteModal.tsx';
import { MarkerSomMinStatus } from './kandidatlistetyper';
import './Kandidatlister.less';
import { KandidatlisterFilter } from './KandidatlisterFilter/KandidatlisterFilter';
import { KandidatlisterSideHeader } from './KandidatlisterSideHeader/KandidatlisterSideHeader';
import { KandidatlisterRad } from './KandidatlisterRad/KandidatlisterRad';
import { Flatknapp } from 'nav-frontend-knapper';
import { Nesteknapp, Søkeknapp } from 'nav-frontend-ikonknapper';
import { ListeoversiktActionType } from './listeoversiktReducer';

const MODALVISING = {
    INGEN_MODAL: 'INGEN_MODAL',
    OPPRETT_MODAL: 'OPPRETT_MODAL',
    ENDRE_MODAL: 'ENDRE_MODAL',
    SLETTE_MODAL: 'SLETTE_MODAL',
    MARKER_SOM_MIN_MODAL: 'MARKER_SOM_MIN_MODAL',
};

const PAGINERING_BATCH_SIZE = 20;

export const SokKandidatlisterInput = ({ sokeOrd, onSokeOrdChange, onSubmitSokKandidatlister }) => (
    <form className="kandidatlister__sok" onSubmit={onSubmitSokKandidatlister}>
        <input
            id={'sok-kandidatlister-input'}
            value={sokeOrd}
            onChange={onSokeOrdChange}
            className="skjemaelement__input"
            placeholder="Skriv inn navn på kandidatliste"
        />
        <Søkeknapp
            type="flat"
            aria-label="sok-kandidatlister-knapp"
            className="kandidatlister__søkeknapp"
            id="sok-kandidatlister-knapp"
            onClick={onSubmitSokKandidatlister}
        />
    </form>
);

const Kandidatlistevisning = ({
    fetching,
    kandidatlister,
    endreKandidatliste,
    onMenyClick,
    onSkjulMeny,
    visKandidatlisteMeny,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    if (fetching !== 'SUCCESS') {
        return (
            <div className="hent-kandidatlister--spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatlister.length === 0) {
        return (
            <div className="liste-rad__tom">
                <Systemtittel>Fant ingen kandidatlister som matcher søket ditt.</Systemtittel>
            </div>
        );
    }

    return kandidatlister.map((kandidatliste) => (
        <KandidatlisterRad
            kandidatliste={kandidatliste}
            endreKandidatliste={endreKandidatliste}
            onMenyClick={onMenyClick}
            onSkjulMeny={onSkjulMeny}
            visKandidatlisteMeny={visKandidatlisteMeny}
            markerKandidatlisteSomMin={markerKandidatlisteSomMin}
            slettKandidatliste={() => {
                slettKandidatliste(kandidatliste);
            }}
            key={kandidatliste.kandidatlisteId}
        />
    ));
};

const ListeHeader = () => (
    <div className="liste-header liste-rad-innhold">
        <div className="kolonne-middels">
            <Element>Dato opprettet</Element>
        </div>
        <div className="kolonne-bred">
            <Element>Navn på kandidatliste</Element>
        </div>
        <div className="kolonne-middels">
            <Element>Antall kandidater</Element>
        </div>
        <div className="kolonne-bred">
            <Element>Veileder</Element>
        </div>
        <div className="kolonne-middels__finn-kandidater">
            <Element>Finn kandidater</Element>
        </div>
        <div className="kolonne-smal">
            <Element>Rediger</Element>
        </div>
        <div className="kolonne-smal">
            <Element>Meny</Element>
        </div>
    </div>
);

export const KanSletteEnum = {
    KAN_SLETTES: 'KAN_SLETTES',
    ER_IKKE_DIN: 'ER_IKKE_DIN',
    HAR_STILLING: 'HAR_STILLING',
    ER_IKKE_DIN_OG_HAR_STILLING: 'ER_IKKE_DIN_OG_HAR_STILLING',
};

const SlettKandidatlisteMenyValg = ({
    kandidatliste,
    slettRef,
    handleKeyDown,
    slettKandidatliste,
}) => {
    if (kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES) {
        return (
            <div
                onClick={slettKandidatliste}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                ref={slettRef}
            >
                Slett
            </div>
        );
    } else if (kandidatliste.kanSlette === KanSletteEnum.HAR_STILLING) {
        return (
            <HjelpetekstVenstre
                className="slett-hjelpetekst"
                id="slett-kandidatliste"
                anchor={() => (
                    <div className="slett-hjelpetekst-tekst" ref={slettRef}>
                        Slett
                    </div>
                )}
            >
                Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.
            </HjelpetekstVenstre>
        );
    } else if (kandidatliste.kanSlette === KanSletteEnum.ER_IKKE_DIN) {
        return (
            <HjelpetekstVenstre
                className="slett-hjelpetekst"
                id="slett-kandidatliste"
                anchor={() => (
                    <div className="slett-hjelpetekst-tekst" ref={slettRef}>
                        Slett
                    </div>
                )}
            >
                Denne kandidatlisten tilhører: {kandidatliste.opprettetAv.navn}. Du kan bare slette
                dine egne lister.
            </HjelpetekstVenstre>
        );
    } else if (kandidatliste.kanSlette === KanSletteEnum.ER_IKKE_DIN_OG_HAR_STILLING) {
        return (
            <HjelpetekstVenstre
                className="slett-hjelpetekst"
                id="slett-kandidatliste"
                anchor={() => (
                    <div className="slett-hjelpetekst-tekst" ref={slettRef}>
                        Slett
                    </div>
                )}
            >
                Du kan ikke slette kandidatlisten fordi den
                <ul>
                    <li>tilhører en annen</li>
                    <li>er knyttet til en stilling</li>
                </ul>
            </HjelpetekstVenstre>
        );
    }
    return null;
};

export const KandidatlisterMenyDropdown = ({
    kandidatliste,
    onSkjulMeny,
    markerSomMinModal,
    slettKandidatliste,
}) => {
    const markerRef = useRef(null);
    const slettRef = useRef(null);

    const hasFocus = () => {
        const active = document.activeElement;
        return (
            markerRef.current === active ||
            slettRef.current === active ||
            active.lastChild === markerRef.current ||
            active.lastChild === slettRef.current ||
            active.className.includes('marker-hjelpetekst') ||
            active.className.includes('lukknapp') ||
            active.className.includes('KandidatlisteMeny') ||
            active.className.includes('slett-hjelpetekst') ||
            active.className.includes('slett-hjelpetekst-lenke')
        );
    };

    const handleCloseMenu = () => {
        window.setTimeout(() => {
            if (!hasFocus()) {
                onSkjulMeny();
            }
        }, 0);
    };

    useEffect(() => {
        document.addEventListener('click', handleCloseMenu, true);
        return () => document.removeEventListener('click', handleCloseMenu, true);
        // eslint-disable-next-line
    }, []);

    const onMarkerClick = () => {
        markerSomMinModal(kandidatliste);
        onSkjulMeny();
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 || event.keyCode === 32) {
            const active = document.activeElement;
            if (active === markerRef.current) {
                onMarkerClick();
            } else if (active === slettRef.current) {
                slettKandidatliste();
            }
        }
    };

    return (
        <div>
            <ul className="kandidatlister-meny" onBlur={handleCloseMenu}>
                {kandidatliste.kanEditere ? (
                    <HjelpetekstVenstre
                        className="marker-hjelpetekst"
                        id="marker-som-min"
                        anchor={() => (
                            <div className="marker-hjelpetekst-tekst" ref={markerRef}>
                                Marker som min
                            </div>
                        )}
                    >
                        Du eier allerede kandidatlisten.
                    </HjelpetekstVenstre>
                ) : (
                    <div
                        onClick={onMarkerClick}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        ref={markerRef}
                    >
                        Marker som min
                    </div>
                )}
                <SlettKandidatlisteMenyValg
                    kandidatliste={kandidatliste}
                    slettRef={slettRef}
                    handleKeyDown={handleKeyDown}
                    slettKandidatliste={slettKandidatliste}
                />
            </ul>
            <div className="arrow-up" />
        </div>
    );
};

const KandidatlisterPaginering = ({
    kandidatlisterSokeKriterier,
    totaltAntallKandidatlister,
    forrigeSide,
    nesteSide,
}) => {
    const sisteSide = Math.ceil(totaltAntallKandidatlister / kandidatlisterSokeKriterier.pagesize);
    return (
        <div className="kandidatlister-table--bottom">
            <Normaltekst>{`Viser side ${
                kandidatlisterSokeKriterier.pagenumber + 1
            } av ${sisteSide}`}</Normaltekst>
            <div className="kandidatlister-table--bottom__buttons">
                {kandidatlisterSokeKriterier.pagenumber > 0 && (
                    <Flatknapp onClick={forrigeSide}>
                        <NavFrontendChevron type="venstre" />
                        Forrige
                    </Flatknapp>
                )}
                {kandidatlisterSokeKriterier.pagenumber < sisteSide - 1 && (
                    <Nesteknapp onClick={nesteSide} />
                )}
            </div>
        </div>
    );
};

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalstatus: MODALVISING.INGEN_MODAL,
            visSuccessMelding: false,
            successMelding: '',
            sokeOrd: this.props.kandidatlisterSokeKriterier.query,
            kandidatlisteIEndring: undefined,
            visKandidatlisteMeny: undefined,
        };
    }

    componentDidMount() {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
        this.resetSearchQuery();
        this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
        this.props.fjernValgtKandidat();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.lagreStatus === LAGRE_STATUS.LOADING &&
            this.props.lagreStatus === LAGRE_STATUS.SUCCESS
        ) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
            this.visSuccessMelding(`Kandidatliste "${this.props.opprettetTittel}" er opprettet`);
            this.onLukkModalClick();
            this.props.resetLagreStatus();
        }
        if (
            prevProps.sletteStatus.kind === Nettstatus.LasterInn &&
            this.props.sletteStatus.kind === Nettstatus.Suksess
        ) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
            this.visSuccessMelding(
                `Kandidatliste "${this.props.sletteStatus.data.slettetTittel}" er slettet`
            );
            this.onLukkModalClick();
            this.props.resetSletteStatus();
        }
        if (
            prevProps.markerSomMinStatus === MarkerSomMinStatus.Loading &&
            this.props.markerSomMinStatus === MarkerSomMinStatus.Success
        ) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
            this.visSuccessMelding('Endringene er lagret');
            this.onLukkModalClick();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.skjulSuccessMeldingCallbackId);
    }

    onFilterChange = (verdi) => {
        const { query, kunEgne, type } = this.props.kandidatlisterSokeKriterier;

        if (verdi !== type) {
            this.props.hentKandidatlister(query, verdi, kunEgne, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onSokeOrdChange = (e) => {
        this.setState({ sokeOrd: e.target.value });
    };

    onSubmitSokKandidatlister = (e) => {
        e.preventDefault();
        const { type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(this.state.sokeOrd, type, kunEgne, 0, PAGINERING_BATCH_SIZE);
    };

    onNullstillSokClick = () => {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
        if (this.state.sokeOrd !== '') {
            this.setState({ sokeOrd: '' });
        }
        if (query !== '' || type !== '' || !kunEgne || pagenumber !== 0) {
            this.props.hentKandidatlister('', '', true, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onOpprettClick = () => {
        this.setState({
            modalstatus: MODALVISING.OPPRETT_MODAL,
        });
    };

    onEndreClick = (kandidatliste) => {
        this.setState({
            modalstatus: MODALVISING.ENDRE_MODAL,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onMenyClick = (kandidatliste) => {
        if (kandidatliste === this.state.visKandidatlisteMeny) {
            this.setState({ visKandidatlisteMeny: undefined });
        } else {
            this.setState({ visKandidatlisteMeny: kandidatliste });
        }
    };

    onSkjulMeny = () => {
        this.setState({ visKandidatlisteMeny: undefined });
    };

    onVisMarkerSomMinModal = (kandidatliste) => {
        this.setState({
            modalstatus: MODALVISING.MARKER_SOM_MIN_MODAL,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onVisSlettKandidatlisteModal = (kandidatliste) => {
        this.setState({
            modalstatus: MODALVISING.SLETTE_MODAL,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onLukkModalClick = () => {
        this.setState({
            modalstatus: MODALVISING.INGEN_MODAL,
            kandidatlisteIEndring: undefined,
        });
    };

    onMarkerKandidatlisteSomMin = () => {
        this.props.markerKandidatlisteSomMin(this.state.kandidatlisteIEndring.kandidatlisteId);
    };

    onVisMineKandidatlister = () => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        if (!kunEgne) {
            this.props.hentKandidatlister(query, type, true, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onVisAlleKandidatlister = () => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        if (kunEgne) {
            this.props.hentKandidatlister(query, type, false, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onHentKandidatlisterForrigeSide = () => {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(
            query,
            type,
            kunEgne,
            Math.max(pagenumber - 1, 0),
            PAGINERING_BATCH_SIZE
        );
    };

    onHentKandidatlisterNesteSide = () => {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(query, type, kunEgne, pagenumber + 1, PAGINERING_BATCH_SIZE);
    };

    resetSearchQuery = () => {
        this.props.resetQuery({
            fritekst: '',
            stillinger: [],
            arbeidserfaringer: [],
            utdanninger: [],
            kompetanser: [],
            geografiList: [],
            geografiListKomplett: [],
            totalErfaring: [],
            utdanningsniva: [],
            sprak: [],
            kvalifiseringsgruppeKoder: [],
            maaBoInnenforGeografi: false,
            harHentetStilling: false,
        });
        this.props.removeKompetanseSuggestions();
    };

    visSuccessMelding = (melding) => {
        this.setState({
            visSuccessMelding: true,
            successMelding: melding,
        });
        this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
    };

    skjulSuccessMelding = () => {
        this.setState({ visSuccessMelding: false });
    };

    render() {
        const {
            kandidatlister,
            totaltAntallKandidatlister,
            fetchingKandidatlister,
            kandidatlisterSokeKriterier,
        } = this.props;
        const {
            modalstatus,
            kandidatlisteIEndring,
            visSuccessMelding,
            successMelding,
            sokeOrd,
            visKandidatlisteMeny,
        } = this.state;
        return (
            <div>
                {modalstatus === MODALVISING.OPPRETT_MODAL && (
                    <OpprettModal onAvbrytClick={this.onLukkModalClick} />
                )}
                {modalstatus === MODALVISING.ENDRE_MODAL && (
                    <EndreModal
                        kandidatliste={kandidatlisteIEndring}
                        onAvbrytClick={this.onLukkModalClick}
                    />
                )}
                {modalstatus === MODALVISING.MARKER_SOM_MIN_MODAL && (
                    <MarkerSomMinModal
                        stillingsId={kandidatlisteIEndring.stillingId}
                        markerKandidatlisteSomMin={this.onMarkerKandidatlisteSomMin}
                        onAvbrytClick={this.onLukkModalClick}
                    />
                )}
                {modalstatus === MODALVISING.SLETTE_MODAL && (
                    <SlettKandidatlisteModal
                        slettKandidatliste={() => {
                            this.props.slettKandidatliste(kandidatlisteIEndring);
                        }}
                        onAvbrytClick={this.onLukkModalClick}
                    />
                )}
                <HjelpetekstFading
                    id="kandidatliste-lagret-melding"
                    synlig={visSuccessMelding}
                    type="suksess"
                    innhold={successMelding}
                />
                <div className="Kandidatlister">
                    <KandidatlisterSideHeader
                        sokeOrd={sokeOrd}
                        onSokeOrdChange={this.onSokeOrdChange}
                        onSubmitSokKandidatlister={this.onSubmitSokKandidatlister}
                        nullstillSok={this.onNullstillSokClick}
                        opprettListe={this.onOpprettClick}
                    />
                    <div className="kandidatlister-wrapper">
                        <KandidatlisterFilter
                            kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                            onVisMineKandidatlister={this.onVisMineKandidatlister}
                            onVisAlleKandidatlister={this.onVisAlleKandidatlister}
                            onFilterChange={this.onFilterChange}
                        />
                        <div className="kandidatlister-table--top">
                            <Systemtittel>{`${
                                totaltAntallKandidatlister === undefined
                                    ? '0'
                                    : totaltAntallKandidatlister
                            } kandidatliste${
                                totaltAntallKandidatlister === 1 ? '' : 'r'
                            }`}</Systemtittel>
                        </div>
                        <div className="kandidatlister-table">
                            <ListeHeader />
                            <Kandidatlistevisning
                                kandidatlister={kandidatlister}
                                endreKandidatliste={this.onEndreClick}
                                onMenyClick={this.onMenyClick}
                                onSkjulMeny={this.onSkjulMeny}
                                markerKandidatlisteSomMin={this.onVisMarkerSomMinModal}
                                slettKandidatliste={this.onVisSlettKandidatlisteModal}
                                visKandidatlisteMeny={visKandidatlisteMeny}
                                fetching={fetchingKandidatlister}
                            />
                        </div>
                        {fetchingKandidatlister === 'SUCCESS' && totaltAntallKandidatlister > 0 && (
                            <KandidatlisterPaginering
                                kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                                totaltAntallKandidatlister={totaltAntallKandidatlister}
                                forrigeSide={this.onHentKandidatlisterForrigeSide}
                                nesteSide={this.onHentKandidatlisterNesteSide}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
    opprettetTittel: state.kandidatliste.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.listeoversikt.kandidatlister.liste,
    totaltAntallKandidatlister: state.listeoversikt.kandidatlister.antall,
    fetchingKandidatlister: state.listeoversikt.hentListerStatus,
    kandidatlisterSokeKriterier: state.listeoversikt.søkekriterier,
    markerSomMinStatus: state.listeoversikt.markerSomMinStatus,
    sletteStatus: state.listeoversikt.slettKandidatlisteStatus,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    hentKandidatlister: (query, type, kunEgne, pagenumber, pagesize) =>
        dispatch({
            type: ListeoversiktActionType.HENT_KANDIDATLISTER,
            query,
            listetype: type,
            kunEgne,
            pagenumber,
            pagesize,
        }),
    resetLagreStatus: () => dispatch({ type: ListeoversiktActionType.RESET_LAGRE_STATUS }),
    markerKandidatlisteSomMin: (kandidatlisteId) => {
        dispatch({ type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN, kandidatlisteId });
    },
    slettKandidatliste: (kandidatliste) => {
        dispatch({ type: ListeoversiktActionType.SLETT_KANDIDATLISTE, kandidatliste });
    },
    resetSletteStatus: () => {
        dispatch({ type: ListeoversiktActionType.RESET_SLETTE_STATUS });
    },
    fjernValgtKandidat: () =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
        }),
});

export const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    opprettetAv: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }).isRequired,
    stillingId: PropTypes.string,
    kanSlette: PropTypes.string.isRequired,
});

KandidatlisterFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool,
        pagenumber: PropTypes.number,
        pagesize: PropTypes.number,
    }).isRequired,
};

SokKandidatlisterInput.propTypes = {
    sokeOrd: PropTypes.string.isRequired,
    onSokeOrdChange: PropTypes.func.isRequired,
    onSubmitSokKandidatlister: PropTypes.func.isRequired,
};

KandidatlisterRad.defaultProps = {
    visKandidatlisteMeny: undefined,
};

KandidatlisterRad.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired,
    endreKandidatliste: PropTypes.func.isRequired,
    onMenyClick: PropTypes.func.isRequired,
    onSkjulMeny: PropTypes.func.isRequired,
    visKandidatlisteMeny: KandidatlisteBeskrivelse,
    markerKandidatlisteSomMin: PropTypes.func.isRequired,
    slettKandidatliste: PropTypes.func.isRequired,
};

KandidatlisterPaginering.defaultProps = {
    totaltAntallKandidatlister: undefined,
};

KandidatlisterPaginering.propTypes = {
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool,
        pagenumber: PropTypes.number,
        pagesize: PropTypes.number,
    }).isRequired,
    totaltAntallKandidatlister: PropTypes.number,
    forrigeSide: PropTypes.func.isRequired,
    nesteSide: PropTypes.func.isRequired,
};

KandidatlisterMenyDropdown.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired,
    onSkjulMeny: PropTypes.func.isRequired,
    markerSomMinModal: PropTypes.func.isRequired,
    slettKandidatliste: PropTypes.func.isRequired,
};

SlettKandidatlisteMenyValg.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired,
    slettRef: PropTypes.any.isRequired, // eslint-disable-line
    handleKeyDown: PropTypes.func.isRequired,
    slettKandidatliste: PropTypes.func.isRequired,
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined,
    totaltAntallKandidatlister: undefined,
};

Kandidatlister.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.string.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    totaltAntallKandidatlister: PropTypes.number,
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    opprettetTittel: PropTypes.string,
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool,
        pagenumber: PropTypes.number,
        pagesize: PropTypes.number,
    }).isRequired,
    markerKandidatlisteSomMin: PropTypes.func.isRequired,
    markerSomMinStatus: PropTypes.string.isRequired,
    slettKandidatliste: PropTypes.func.isRequired,
    resetSletteStatus: PropTypes.func.isRequired,
    sletteStatus: PropTypes.shape({
        kind: PropTypes.string.isRequired,
        data: PropTypes.shape({
            slettetTittel: PropTypes.string,
        }),
    }).isRequired,
    fjernValgtKandidat: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
