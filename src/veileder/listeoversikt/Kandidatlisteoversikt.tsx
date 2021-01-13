import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';

import { KandidatlisteView, MarkerSomMinStatus } from '../kandidatliste/kandidatlistetyper';
import { KandidatlisterFilter } from './KandidatlisterFilter/KandidatlisterFilter';
import { KandidatlisterSideHeader } from './KandidatlisterSideHeader/KandidatlisterSideHeader';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { ListeoversiktActionType } from './reducer/ListeoversiktAction';
import { Nettressurs, Nettstatus } from '../../felles/common/remoteData';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SET_STATE } from '../sok/searchReducer';
import AppState from '../AppState';
import EndreModal from './modaler/EndreModal';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatlistevisning from './Kandidatlistevisning';
import ListeHeader from './ListeHeader';
import MarkerSomMinModal from './modaler/MarkerSomMinModal';
import OpprettModal from './modaler/OpprettModal';
import Paginering from './Paginering';
import SlettKandidatlisteModal from './modaler/SlettKandidatlisteModal';
import './Kandidatlisteoversikt.less';

enum Modalvisning {
    Ingen = 'INGEN_MODAL',
    Opprett = 'OPPRETT_MODAL',
    Endre = 'ENDRE_MODAL',
    Slette = 'SLETTE_MODAL',
    MarkerSomMin = 'MARKER_SOM_MIN_MODAL',
}

const PAGINERING_BATCH_SIZE = 20;

export const KanSletteEnum = {
    KAN_SLETTES: 'KAN_SLETTES',
    ER_IKKE_DIN: 'ER_IKKE_DIN',
    HAR_STILLING: 'HAR_STILLING',
    ER_IKKE_DIN_OG_HAR_STILLING: 'ER_IKKE_DIN_OG_HAR_STILLING',
};

export type KandidatlisterSøkekriterier = {
    query: string;
    type: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
};

type Props = {
    resetQuery: any;
    removeKompetanseSuggestions: any;
    hentKandidatlister: any;
    fetchingKandidatlister: any;
    kandidatlister: KandidatlisteView[];
    totaltAntallKandidatlister: any;
    lagreStatus: any;
    resetLagreStatus: any;
    opprettetTittel: any;
    kandidatlisterSokeKriterier: KandidatlisterSøkekriterier;
    markerKandidatlisteSomMin: (kandidatlisteId: string) => void;
    markerSomMinStatus: any;
    slettKandidatliste: any;
    resetSletteStatus: any;
    sletteStatus: Nettressurs<{ slettetTittel: string }>;
    fjernValgtKandidat: any;
};

class Kandidatlisteoversikt extends React.Component<Props> {
    skjulSuccessMeldingCallbackId: any;

    state: {
        modalstatus: Modalvisning;
        visSuccessMelding: boolean;
        successMelding: string;
        søkeOrd: string;
        kandidatlisteIEndring: any;
        visKandidatlisteMeny: any;
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            modalstatus: Modalvisning.Ingen,
            visSuccessMelding: false,
            successMelding: '',
            søkeOrd: this.props.kandidatlisterSokeKriterier.query,
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

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.lagreStatus === LAGRE_STATUS.LOADING &&
            this.props.lagreStatus === LAGRE_STATUS.SUCCESS
        ) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
            this.visSuccessMelding('Endringen er lagret.');
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
        if (this.skjulSuccessMeldingCallbackId) {
            clearTimeout(this.skjulSuccessMeldingCallbackId);
        }
    }

    onFilterChange = (verdi: string) => {
        const { query, kunEgne, type } = this.props.kandidatlisterSokeKriterier;

        if (verdi !== type) {
            this.props.hentKandidatlister(query, verdi, kunEgne, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onSøkeOrdChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ søkeOrd: event.target.value });
    };

    onSubmitSøkKandidatlister = (e) => {
        e.preventDefault();
        const { type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(this.state.søkeOrd, type, kunEgne, 0, PAGINERING_BATCH_SIZE);
    };

    onNullstillSøkClick = () => {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
        if (this.state.søkeOrd !== '') {
            this.setState({ søkeOrd: '' });
        }
        if (query !== '' || type !== '' || !kunEgne || pagenumber !== 0) {
            this.props.hentKandidatlister('', '', true, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onOpprettClick = () => {
        this.setState({
            modalstatus: Modalvisning.Opprett,
        });
    };

    onEndreClick = (kandidatliste: KandidatlisteView) => {
        this.setState({
            modalstatus: Modalvisning.Endre,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onMenyClick = (kandidatliste: KandidatlisteView) => {
        if (kandidatliste === this.state.visKandidatlisteMeny) {
            this.setState({ visKandidatlisteMeny: undefined });
        } else {
            this.setState({ visKandidatlisteMeny: kandidatliste });
        }
    };

    onSkjulMeny = () => {
        this.setState({ visKandidatlisteMeny: undefined });
    };

    onVisMarkerSomMinModal = (kandidatliste: KandidatlisteView) => {
        this.setState({
            modalstatus: Modalvisning.MarkerSomMin,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onVisSlettKandidatlisteModal = (kandidatliste: KandidatlisteView) => {
        this.setState({
            modalstatus: Modalvisning.Slette,
            kandidatlisteIEndring: kandidatliste,
        });
    };

    onLukkModalClick = () => {
        this.setState({
            modalstatus: Modalvisning.Ingen,
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

    visSuccessMelding = (melding: string) => {
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
            søkeOrd,
        } = this.state;
        return (
            <div>
                {modalstatus === Modalvisning.Opprett && (
                    <OpprettModal onAvbrytClick={this.onLukkModalClick} />
                )}
                {modalstatus === Modalvisning.Endre && (
                    <EndreModal
                        kandidatliste={kandidatlisteIEndring}
                        onAvbrytClick={this.onLukkModalClick}
                    />
                )}
                {modalstatus === Modalvisning.MarkerSomMin && (
                    <MarkerSomMinModal
                        stillingsId={kandidatlisteIEndring.stillingId}
                        markerKandidatlisteSomMin={this.onMarkerKandidatlisteSomMin}
                        onAvbrytClick={this.onLukkModalClick}
                    />
                )}
                {modalstatus === Modalvisning.Slette && (
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
                        søkeOrd={søkeOrd}
                        onSøkeOrdChange={this.onSøkeOrdChange}
                        onSubmitSøkKandidatlister={this.onSubmitSøkKandidatlister}
                        nullstillSøk={this.onNullstillSøkClick}
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
                                markerKandidatlisteSomMin={this.onVisMarkerSomMinModal}
                                slettKandidatliste={this.onVisSlettKandidatlisteModal}
                                fetching={fetchingKandidatlister}
                            />
                        </div>
                        {fetchingKandidatlister === 'SUCCESS' && totaltAntallKandidatlister > 0 && (
                            <Paginering
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

const mapStateToProps = (state: AppState) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
    opprettetTittel: state.kandidatliste.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.listeoversikt.kandidatlister.liste,
    totaltAntallKandidatlister: state.listeoversikt.kandidatlister.antall,
    fetchingKandidatlister: state.listeoversikt.hentListerStatus,
    kandidatlisterSokeKriterier: state.listeoversikt.søkekriterier,
    markerSomMinStatus: state.listeoversikt.markerSomMinStatus,
    sletteStatus: state.listeoversikt.slettKandidatlisteStatus,
});

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    resetQuery: (query: any) => dispatch({ type: SET_STATE, query }),
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
    resetLagreStatus: () => dispatch({ type: KandidatlisteActionType.RESET_LAGRE_STATUS }),
    markerKandidatlisteSomMin: (kandidatlisteId: string) => {
        dispatch({ type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN, kandidatlisteId });
    },
    slettKandidatliste: (kandidatliste: KandidatlisteView) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteoversikt);
