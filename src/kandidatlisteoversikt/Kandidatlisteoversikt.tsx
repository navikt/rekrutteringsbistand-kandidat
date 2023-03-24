import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Heading, Pagination } from '@navikt/ds-react';

import { KandidatlisteSammendrag } from '../kandidatliste/domene/Kandidatliste';
import { ListeoversiktAction, ListeoversiktActionType } from './reducer/ListeoversiktAction';
import { Nettstatus } from '../api/Nettressurs';
import Filter, { Stillingsfilter } from './filter/Filter';
import Header from './header/Header';
import AppState from '../AppState';
import EndreModal from './modaler/EndreModal';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import TabellBody from './tabell/TabellBody';
import TabellHeader from './tabell/TabellHeader';
import MarkerSomMinModal from './modaler/MarkerSomMinModal';
import OpprettModal from './modaler/OpprettModal';
import SlettModal from './modaler/SlettModal';
import Kandidatlistetabell from './tabell/Kandidatlistetabell';
import css from './Kandidatlisteoversikt.module.css';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import { Søkekriterier } from './reducer/listeoversiktReducer';

const SIDESTØRRELSE = 20;

enum Modalvisning {
    Ingen,
    Opprett,
    Endre,
    Slette,
    MarkerSomMin,
}

type ModalMedKandidatliste = {
    visning: Modalvisning.Endre | Modalvisning.MarkerSomMin | Modalvisning.Slette;
    kandidatliste: KandidatlisteSammendrag;
};

type ModalUtenKandidatliste = {
    visning: Modalvisning.Opprett | Modalvisning.Ingen;
};

export type KandidatlisterSøkekriterier = {
    query: string;
    type: Stillingsfilter;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
};

type Props = {
    hentKandidatlister: (søkekriterier: Søkekriterier) => void;
    kandidatlisterStatus: Nettstatus;
    kandidatlister: KandidatlisteSammendrag[];
    totaltAntallKandidatlister: number;
    søkekriterier: KandidatlisterSøkekriterier;
    nullstillValgtKandidatIKandidatliste: () => void;
};

class Kandidatlisteoversikt extends React.Component<Props> {
    state: {
        søkeOrd: string;
        modal: ModalUtenKandidatliste | ModalMedKandidatliste;
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            søkeOrd: this.props.søkekriterier.query,
            modal: {
                visning: Modalvisning.Ingen,
            },
        };
    }

    componentDidMount() {
        this.refreshKandidatlister();
        this.props.nullstillValgtKandidatIKandidatliste();
    }

    refreshKandidatlister = () => {
        const { query, type, kunEgne, pagenumber } = this.props.søkekriterier;
        this.props.hentKandidatlister({
            query,
            type,
            kunEgne,
            pagenumber,
            pagesize: SIDESTØRRELSE,
        });
    };

    onFilterChange = (verdi: Stillingsfilter) => {
        const { query, kunEgne, type } = this.props.søkekriterier;

        if (verdi !== type) {
            this.props.hentKandidatlister({
                query,
                type: verdi,
                kunEgne,
                pagenumber: 0,
                pagesize: SIDESTØRRELSE,
            });
        }
    };

    onSøkeOrdChange = (value: string) => {
        this.setState({ søkeOrd: value });
    };

    onSubmitSøkKandidatlister = (e) => {
        e.preventDefault();
        const { type, kunEgne } = this.props.søkekriterier;
        this.props.hentKandidatlister({
            query: this.state.søkeOrd,
            type,
            kunEgne,
            pagenumber: 0,
            pagesize: SIDESTØRRELSE,
        });
    };

    onNullstillSøkClick = () => {
        const { query, type, kunEgne, pagenumber } = this.props.søkekriterier;
        if (this.state.søkeOrd !== '') {
            this.setState({ søkeOrd: '' });
        }

        if (query !== '' || type !== '' || !kunEgne || pagenumber !== 0) {
            this.props.hentKandidatlister({
                query: '',
                type: Stillingsfilter.Ingen,
                kunEgne: true,
                pagenumber: 0,
                pagesize: SIDESTØRRELSE,
            });
        }
    };

    onOpprettClick = () => {
        this.setState({
            modal: {
                visning: Modalvisning.Opprett,
            },
        });
    };

    handleRedigerClick = (kandidatliste: KandidatlisteSammendrag) => {
        this.setState({
            modal: {
                visning: Modalvisning.Endre,
                kandidatliste,
            },
        });
    };

    handleMarkerSomMinClick = (kandidatliste: KandidatlisteSammendrag) => {
        this.setState({
            modal: {
                visning: Modalvisning.MarkerSomMin,
                kandidatliste,
            },
        });
    };

    handleSlettClick = (kandidatliste: KandidatlisteSammendrag) => {
        this.setState({
            modal: {
                visning: Modalvisning.Slette,
                kandidatliste,
            },
        });
    };

    handleLukkModal = (refreshKandidatlister?: boolean) => {
        this.setState({
            modal: {
                visning: Modalvisning.Ingen,
            },
        });

        if (refreshKandidatlister === true) {
            this.refreshKandidatlister();
        }
    };

    onVisMineKandidatlister = () => {
        const { query, type, kunEgne } = this.props.søkekriterier;
        if (!kunEgne) {
            this.props.hentKandidatlister({
                query,
                type,
                kunEgne: true,
                pagenumber: 0,
                pagesize: SIDESTØRRELSE,
            });
        }
    };

    onVisAlleKandidatlister = () => {
        const { query, type, kunEgne } = this.props.søkekriterier;
        if (kunEgne) {
            this.props.hentKandidatlister({
                query,
                type,
                kunEgne: false,
                pagenumber: 0,
                pagesize: SIDESTØRRELSE,
            });
        }
    };

    onPageChange = (nyttSidenummer: number) => {
        const { query, type, kunEgne } = this.props.søkekriterier;
        this.props.hentKandidatlister({
            query,
            type,
            kunEgne,
            pagenumber: nyttSidenummer - 1,
            pagesize: SIDESTØRRELSE,
        });
    };

    visSuccessMelding = (melding: string) => {
        this.setState({
            visSuccessMelding: true,
            successMelding: melding,
        });
    };

    render() {
        const { kandidatlister, totaltAntallKandidatlister, kandidatlisterStatus, søkekriterier } =
            this.props;
        const { søkeOrd, modal } = this.state;

        const tittel = `${
            totaltAntallKandidatlister === undefined ? '0' : totaltAntallKandidatlister
        } kandidatliste${totaltAntallKandidatlister === 1 ? '' : 'r'}`;

        return (
            <div>
                {modal.visning === Modalvisning.Opprett && (
                    <OpprettModal onClose={this.handleLukkModal} />
                )}
                {modal.visning === Modalvisning.Endre && (
                    <EndreModal
                        kandidatliste={modal.kandidatliste}
                        onClose={this.handleLukkModal}
                    />
                )}
                {modal.visning === Modalvisning.MarkerSomMin && (
                    <MarkerSomMinModal
                        kandidatliste={modal.kandidatliste}
                        stillingsId={modal.kandidatliste.stillingId}
                        onClose={this.handleLukkModal}
                    />
                )}
                {modal.visning === Modalvisning.Slette && (
                    <SlettModal
                        kandidatliste={modal.kandidatliste}
                        onClose={this.handleLukkModal}
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
                        søkekriterier={søkekriterier}
                        onVisMineKandidatlister={this.onVisMineKandidatlister}
                        onVisAlleKandidatlister={this.onVisAlleKandidatlister}
                        onFilterChange={this.onFilterChange}
                    />
                    <div className={css.antallKandidatlister}>
                        <Heading level="1" size="medium">
                            {tittel}
                        </Heading>
                    </div>
                    <Kandidatlistetabell
                        className={css.tabell}
                        nettstatus={kandidatlisterStatus}
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
                    {kandidatlisterStatus === Nettstatus.Suksess && (
                        <Pagination
                            page={søkekriterier.pagenumber + 1}
                            count={Math.ceil(totaltAntallKandidatlister / SIDESTØRRELSE)}
                            onPageChange={this.onPageChange}
                            className={classNames(css.underTabell, css.paginering)}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    kandidatlisterStatus: state.listeoversikt.hentListerStatus,
    kandidatlister: state.listeoversikt.kandidatlister.liste,
    totaltAntallKandidatlister: state.listeoversikt.kandidatlister.antall,
    søkekriterier: state.listeoversikt.søkekriterier,
});

const mapDispatchToProps = (
    dispatch: (action: ListeoversiktAction | KandidatlisteAction) => void
) => ({
    hentKandidatlister: (søkekriterier: Søkekriterier) =>
        dispatch({
            type: ListeoversiktActionType.HentKandidatlister,
            søkekriterier,
        }),
    nullstillValgtKandidatIKandidatliste: () =>
        dispatch({
            type: KandidatlisteActionType.VelgKandidat,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteoversikt);
