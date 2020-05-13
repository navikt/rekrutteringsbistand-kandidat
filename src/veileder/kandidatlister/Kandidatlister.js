import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Fieldset, Radio } from 'nav-frontend-skjema';
import { HjelpetekstUnderVenstre, HjelpetekstVenstre } from 'nav-frontend-hjelpetekst';
import { Hovedknapp, Knapp, Flatknapp } from 'pam-frontend-knapper';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';

import { formatterDato } from '../../felles/common/dateUtils';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SET_STATE } from '../sok/searchReducer';
import EndreModal from './modaler/EndreModal';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import Lenkeknapp from '../../felles/common/lenkeknapp/Lenkeknapp.tsx';
import MarkerSomMinModal from './modaler/MarkerSomMinModal';
import OpprettModal from './modaler/OpprettModal';
import SlettKandidatlisteModal from './modaler/SlettKandidatlisteModal.tsx';
import { MarkerSomMinStatus } from './kandidatlistetyper';
import './Kandidatlister.less';

const MODALVISING = {
    INGEN_MODAL: 'INGEN_MODAL',
    OPPRETT_MODAL: 'OPPRETT_MODAL',
    ENDRE_MODAL: 'ENDRE_MODAL',
    SLETTE_MODAL: 'SLETTE_MODAL',
    MARKER_SOM_MIN_MODAL: 'MARKER_SOM_MIN_MODAL',
};

const PAGINERING_BATCH_SIZE = 20;

const SokKandidatlisterInput = ({ sokeOrd, onSokeOrdChange, onSubmitSokKandidatlister }) => (
    <form className="kandidatlister__sok" onSubmit={onSubmitSokKandidatlister}>
        <input
            id={'sok-kandidatlister-input'}
            value={sokeOrd}
            onChange={onSokeOrdChange}
            className="skjemaelement__input"
            placeholder="Skriv inn navn på kandidatliste"
        />
        <Knapp
            aria-label="sok-kandidatlister-knapp"
            className="search-button"
            id="sok-kandidatlister-knapp"
            onClick={onSubmitSokKandidatlister}
        >
            <i className="search-button__icon" />
        </Knapp>
    </form>
);

const SideHeader = ({
    sokeOrd,
    onSokeOrdChange,
    onSubmitSokKandidatlister,
    nullstillSok,
    opprettListe,
}) => (
    <div className="side-header">
        <div className="side-header__innhold">
            <div className="header-child" />
            <div className="header-child tittel-wrapper">
                <SokKandidatlisterInput
                    sokeOrd={sokeOrd}
                    onSokeOrdChange={onSokeOrdChange}
                    onSubmitSokKandidatlister={onSubmitSokKandidatlister}
                />
            </div>
            <div className="header-child knapp-wrapper">
                <Flatknapp onClick={nullstillSok} className="nullstill-sok__knapp" mini>
                    Nullstill søk
                </Flatknapp>
                <Hovedknapp onClick={opprettListe} id="opprett-ny-liste">
                    Opprett ny
                </Hovedknapp>
            </div>
        </div>
    </div>
);

const KandidatlisterRadioFilter = ({ kandidatlisterSokeKriterier, onFilterChange }) => (
    <div className="kandidatlister__filter skjemaelement--pink">
        <Fieldset legend="Kandidatlister">
            <Radio
                id="alle-kandidatlister-radio"
                label="Alle kandidatlister"
                name="kandidatlisterFilter"
                value=""
                checked={kandidatlisterSokeKriterier.type === ''}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-til-stilling-radio"
                label="Kandidatlister knyttet til stilling"
                name="kandidatlisterFilter"
                value="MED_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'MED_STILLING'}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-uten-stilling-radio"
                label="Kandidatlister uten stilling"
                name="kandidatlisterFilter"
                value="UTEN_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'UTEN_STILLING'}
                onChange={onFilterChange}
            />
        </Fieldset>
    </div>
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
        <KandidatlisteRad
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

const KandidatlisteRad = ({
    kandidatliste,
    endreKandidatliste,
    onMenyClick,
    onSkjulMeny,
    visKandidatlisteMeny,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => (
    <div className="liste-rad liste-rad-innhold">
        <div className="kolonne-middels">
            <Normaltekst className="tekst">{`${formatterDato(
                new Date(kandidatliste.opprettetTidspunkt)
            )}`}</Normaltekst>
        </div>
        <div className="kolonne-bred">
            <Link
                to={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                className="tekst link"
            >
                {kandidatliste.tittel}
            </Link>
        </div>
        <div className="kolonne-middels">
            <Normaltekst className="tekst">{kandidatliste.kandidater.length}</Normaltekst>
        </div>
        <div className="kolonne-bred">
            <Normaltekst className="tekst">{`${kandidatliste.opprettetAv.navn} (${kandidatliste.opprettetAv.ident})`}</Normaltekst>
        </div>
        <div className="kolonne-middels__finn-kandidater">
            <Link
                aria-label={`Finn kandidater til listen ${kandidatliste.tittel}`}
                to={
                    kandidatliste.stillingId
                        ? `/kandidater/stilling/${kandidatliste.stillingId}`
                        : `/kandidater/kandidatliste/${kandidatliste.kandidatlisteId}`
                }
                className="FinnKandidater"
            >
                <i className="FinnKandidater__icon" />
            </Link>
        </div>
        <div className="kolonne-smal-knapp">
            {kandidatliste.kanEditere ? (
                <Lenkeknapp
                    aria-label={`Endre kandidatlisten ${kandidatliste.tittel}`}
                    onClick={() => endreKandidatliste(kandidatliste)}
                    className="Edit"
                >
                    <i className="Edit__icon" />
                </Lenkeknapp>
            ) : (
                <HjelpetekstUnderVenstre
                    id="rediger-knapp"
                    anchor={() => <i className="EditDisabled__icon" />}
                >
                    Du kan ikke redigere en kandidatliste som ikke er din.
                </HjelpetekstUnderVenstre>
            )}
        </div>
        <div className="kolonne-smal-knapp">
            <Lenkeknapp
                aria-label={`Meny for kandidatlisten ${kandidatliste.tittel}`}
                onClick={() => {
                    onMenyClick(kandidatliste);
                }}
                className="KandidatlisteMeny"
            >
                <i className="KandidatlisteMeny__icon" />
            </Lenkeknapp>
        </div>
        {visKandidatlisteMeny &&
            visKandidatlisteMeny.kandidatlisteId === kandidatliste.kandidatlisteId && (
                <KandidatlisterMenyDropdown
                    kandidatliste={kandidatliste}
                    onSkjulMeny={onSkjulMeny}
                    markerSomMinModal={markerKandidatlisteSomMin}
                    slettKandidatliste={slettKandidatliste}
                />
            )}
    </div>
);

const KanSletteEnum = {
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

const KandidatlisterMenyDropdown = ({
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

const KandidatlisterKnappeFilter = ({
    kandidatlisterSokeKriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
}) => (
    <div>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${
                kandidatlisterSokeKriterier.kunEgne ? ' knapp--aktiv' : ''
            }`}
            onClick={onVisMineKandidatlister}
        >
            <Element>Mine kandidatlister</Element>
        </Flatknapp>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${
                kandidatlisterSokeKriterier.kunEgne ? '' : ' knapp--aktiv'
            }`}
            onClick={onVisAlleKandidatlister}
        >
            <Element>Alle kandidatlister</Element>
        </Flatknapp>
    </div>
);

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
                    <Flatknapp onClick={nesteSide}>
                        Neste
                        <NavFrontendChevron type="høyre" />
                    </Flatknapp>
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

    onFilterChange = (e) => {
        const { query, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(query, e.target.value, kunEgne, 0, PAGINERING_BATCH_SIZE);
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
                    <SideHeader
                        sokeOrd={sokeOrd}
                        onSokeOrdChange={this.onSokeOrdChange}
                        onSubmitSokKandidatlister={this.onSubmitSokKandidatlister}
                        nullstillSok={this.onNullstillSokClick}
                        opprettListe={this.onOpprettClick}
                    />
                    <div className="kandidatlister-wrapper">
                        <KandidatlisterRadioFilter
                            kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                            onFilterChange={this.onFilterChange}
                        />
                        <div className="kandidatlister-table__wrapper">
                            <div className="kandidatlister-table--top">
                                <Systemtittel>{`${
                                    totaltAntallKandidatlister === undefined
                                        ? '0'
                                        : totaltAntallKandidatlister
                                } kandidatliste${
                                    totaltAntallKandidatlister === 1 ? '' : 'r'
                                }`}</Systemtittel>
                                <KandidatlisterKnappeFilter
                                    kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                                    onVisMineKandidatlister={this.onVisMineKandidatlister}
                                    onVisAlleKandidatlister={this.onVisAlleKandidatlister}
                                />
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
                            {fetchingKandidatlister === 'SUCCESS' &&
                                totaltAntallKandidatlister > 0 && (
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
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.kandidatlister.liste,
    totaltAntallKandidatlister: state.kandidatlister.kandidatlister.antall,
    fetchingKandidatlister: state.kandidatlister.hentListerStatus,
    kandidatlisterSokeKriterier: state.kandidatlister.kandidatlisterSokeKriterier,
    markerSomMinStatus: state.kandidatlister.markerSomMinStatus,
    sletteStatus: state.kandidatlister.slettKandidatlisteStatus,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    hentKandidatlister: (query, type, kunEgne, pagenumber, pagesize) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTER,
            query,
            listetype: type,
            kunEgne,
            pagenumber,
            pagesize,
        }),
    resetLagreStatus: () => dispatch({ type: KandidatlisteActionType.RESET_LAGRE_STATUS }),
    markerKandidatlisteSomMin: (kandidatlisteId) => {
        dispatch({ type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN, kandidatlisteId });
    },
    slettKandidatliste: (kandidatliste) => {
        dispatch({ type: KandidatlisteActionType.SLETT_KANDIDATLISTE, kandidatliste });
    },
    resetSletteStatus: () => {
        dispatch({ type: KandidatlisteActionType.RESET_SLETTE_STATUS });
    },
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

SideHeader.defaultProps = {
    sokeOrd: '',
};

SideHeader.propTypes = {
    sokeOrd: PropTypes.string,
    onSokeOrdChange: PropTypes.func.isRequired,
    onSubmitSokKandidatlister: PropTypes.func.isRequired,
    nullstillSok: PropTypes.func.isRequired,
    opprettListe: PropTypes.func.isRequired,
};

KandidatlisterRadioFilter.propTypes = {
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

KandidatlisterKnappeFilter.propTypes = {
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool,
        pagenumber: PropTypes.number,
        pagesize: PropTypes.number,
    }).isRequired,
    onVisMineKandidatlister: PropTypes.func.isRequired,
    onVisAlleKandidatlister: PropTypes.func.isRequired,
};

KandidatlisteRad.defaultProps = {
    visKandidatlisteMeny: undefined,
};

KandidatlisteRad.propTypes = {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
