import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { KandidatlisteSammendrag } from '../kandidatliste/domene/Kandidatliste';
import { ListeoversiktActionType } from './reducer/ListeoversiktAction';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import Filter from './filter/Filter';
import Header from './header/Header';
import AppState from '../AppState';
import EndreModal from './modaler/EndreModal';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import TabellBody from './tabell/TabellBody';
import TabellHeader from './tabell/TabellHeader';
import MarkerSomMinModal from './modaler/MarkerSomMinModal';
import OpprettModal from './modaler/OpprettModal';
import SlettModal from './modaler/SlettModal';
import { Heading, Pagination } from '@navikt/ds-react';
import Kandidatlistetabell from './tabell/Kandidatlistetabell';
import css from './Kandidatlisteoversikt.module.css';

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
    hentKandidatlister: any;
    fetchingKandidatlister: any;
    kandidatlister: KandidatlisteSammendrag[];
    totaltAntallKandidatlister: any;
    kandidatlisterSokeKriterier: KandidatlisterSøkekriterier;
    slettKandidatliste: any;
    resetSletteStatus: any;
    sletteStatus: Nettressurs<{ slettetTittel: string }>;
    nullstillValgtKandidatIKandidatliste: any;
};

class Kandidatlisteoversikt extends React.Component<Props> {
    state: {
        modalstatus: Modalvisning;
        søkeOrd: string;
        kandidatlisteIEndring: any;
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            modalstatus: Modalvisning.Ingen,
            søkeOrd: this.props.kandidatlisterSokeKriterier.query,
            kandidatlisteIEndring: undefined,
        };
    }

    componentDidMount() {
        const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;

        this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
        this.props.nullstillValgtKandidatIKandidatliste();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.sletteStatus.kind === Nettstatus.LasterInn &&
            this.props.sletteStatus.kind === Nettstatus.Suksess
        ) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
            this.visSuccessMelding(
                `Kandidatliste "${this.props.sletteStatus.data.slettetTittel}" er slettet`
            );
            this.onLukkModal();
            this.props.resetSletteStatus();
        }
    }

    onFilterChange = (verdi: string) => {
        const { query, kunEgne, type } = this.props.kandidatlisterSokeKriterier;

        if (verdi !== type) {
            this.props.hentKandidatlister(query, verdi, kunEgne, 0, PAGINERING_BATCH_SIZE);
        }
    };

    onSøkeOrdChange = (value: string) => {
        this.setState({ søkeOrd: value });
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

    handleRedigerClick = (kandidatlisteSammendrag: KandidatlisteSammendrag) => {
        this.setState({
            modalstatus: Modalvisning.Endre,
            kandidatlisteIEndring: kandidatlisteSammendrag,
        });
    };

    handleMarkerSomMinClick = (kandidatlisteSammendrag: KandidatlisteSammendrag) => {
        this.setState({
            modalstatus: Modalvisning.MarkerSomMin,
            kandidatlisteIEndring: kandidatlisteSammendrag,
        });
    };

    handleSlettClick = (kandidatlisteSammendrag: KandidatlisteSammendrag) => {
        this.setState({
            modalstatus: Modalvisning.Slette,
            kandidatlisteIEndring: kandidatlisteSammendrag,
        });
    };

    onLukkModal = (refreshKandidatlister: boolean = true) => {
        this.setState({
            modalstatus: Modalvisning.Ingen,
            kandidatlisteIEndring: undefined,
        });

        if (refreshKandidatlister) {
            const { query, type, kunEgne, pagenumber } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne, pagenumber, PAGINERING_BATCH_SIZE);
        }
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

    onPageChange = (nyttSidenummer: number) => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(
            query,
            type,
            kunEgne,
            nyttSidenummer - 1,
            PAGINERING_BATCH_SIZE
        );
    };

    visSuccessMelding = (melding: string) => {
        this.setState({
            visSuccessMelding: true,
            successMelding: melding,
        });
    };

    render() {
        const {
            kandidatlister,
            totaltAntallKandidatlister,
            fetchingKandidatlister,
            kandidatlisterSokeKriterier,
        } = this.props;
        const { modalstatus, kandidatlisteIEndring, søkeOrd } = this.state;
        return (
            <div>
                {modalstatus === Modalvisning.Opprett && (
                    <OpprettModal onClose={this.onLukkModal} />
                )}
                {modalstatus === Modalvisning.Endre && (
                    <EndreModal kandidatliste={kandidatlisteIEndring} onClose={this.onLukkModal} />
                )}
                {modalstatus === Modalvisning.MarkerSomMin && (
                    <MarkerSomMinModal
                        kandidatliste={kandidatlisteIEndring}
                        stillingsId={kandidatlisteIEndring.stillingId}
                        onClose={this.onLukkModal}
                    />
                )}
                {modalstatus === Modalvisning.Slette && (
                    <SlettModal
                        slettKandidatliste={() => {
                            this.props.slettKandidatliste(kandidatlisteIEndring);
                        }}
                        onAvbrytClick={this.onLukkModal}
                    />
                )}
                <Header
                    søkeOrd={søkeOrd}
                    onSøkeOrdChange={this.onSøkeOrdChange}
                    onSubmitSøkKandidatlister={this.onSubmitSøkKandidatlister}
                    nullstillSøk={this.onNullstillSøkClick}
                    opprettListe={this.onOpprettClick}
                />
                <div className={css.wrapper}>
                    <Filter
                        className={css.filter}
                        kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                        onVisMineKandidatlister={this.onVisMineKandidatlister}
                        onVisAlleKandidatlister={this.onVisAlleKandidatlister}
                        onFilterChange={this.onFilterChange}
                    />
                    <div className={css.antallKandidatlister}>
                        <Heading level="1" size="medium">{`${
                            totaltAntallKandidatlister === undefined
                                ? '0'
                                : totaltAntallKandidatlister
                        } kandidatliste${totaltAntallKandidatlister === 1 ? '' : 'r'}`}</Heading>
                    </div>
                    <Kandidatlistetabell
                        className={css.tabell}
                        nettstatus={fetchingKandidatlister}
                        kandidatlister={kandidatlister}
                    >
                        <TabellHeader />
                        <TabellBody
                            kandidatlister={kandidatlister}
                            onRedigerClick={this.handleRedigerClick}
                            onMarkerSomMinClick={this.handleMarkerSomMinClick}
                            onSlettClick={this.handleSlettClick}
                        />
                    </Kandidatlistetabell>
                    {fetchingKandidatlister === Nettstatus.Suksess && (
                        <Pagination
                            className={classNames(css.underTabell, css.paginering)}
                            page={kandidatlisterSokeKriterier.pagenumber + 1}
                            onPageChange={this.onPageChange}
                            count={Math.ceil(totaltAntallKandidatlister / PAGINERING_BATCH_SIZE)}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    kandidatlister: state.listeoversikt.kandidatlister.liste,
    totaltAntallKandidatlister: state.listeoversikt.kandidatlister.antall,
    fetchingKandidatlister: state.listeoversikt.hentListerStatus,
    kandidatlisterSokeKriterier: state.listeoversikt.søkekriterier,
    sletteStatus: state.listeoversikt.slettKandidatlisteStatus,
});

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    hentKandidatlister: (query, type, kunEgne, pagenumber, pagesize) =>
        dispatch({
            type: ListeoversiktActionType.HentKandidatlister,
            query,
            listetype: type,
            kunEgne,
            pagenumber,
            pagesize,
        }),
    slettKandidatliste: (kandidatlisteSammendrag: KandidatlisteSammendrag) => {
        dispatch({
            type: ListeoversiktActionType.SlettKandidatliste,
            kandidatliste: kandidatlisteSammendrag,
        });
    },
    resetSletteStatus: () => {
        dispatch({ type: ListeoversiktActionType.ResetSletteStatus });
    },
    nullstillValgtKandidatIKandidatliste: () =>
        dispatch({
            type: KandidatlisteActionType.VelgKandidat,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteoversikt);
