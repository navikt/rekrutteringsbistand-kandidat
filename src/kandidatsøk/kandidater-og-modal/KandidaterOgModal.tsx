/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Undertittel } from 'nav-frontend-typografi';

import { CvSøkeresultat } from '../../kandidatside/cv/reducer/cv-typer';
import { formatterInt } from '../utils';
import { Kandidatliste } from '../../kandidatliste/kandidatlistetyper';
import { KANDIDATLISTE_CHUNK_SIZE } from '../../common/konstanter';
import { KandidatOutboundDto } from '../../kandidatliste/modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { KandidatsøkAction, KandidatsøkActionType } from '../reducer/searchActions';
import { Nettstatus } from '../../api/remoteData';
import AppState from '../../AppState';
import KandidaterTabell from '../kandidater-tabell/KandidaterTabell';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import KnappMedHjelpetekst from '../knappMedHjelpetekst/KnappMedHjelpetekst';
import LagreKandidaterModal from '../modaler/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../modaler/LagreKandidaterTilStillingModal';

const hentAntallMarkerteResultater = (kandidater: MarkerbartSøkeresultat[]) =>
    kandidater.filter((k) => k.markert).length;

const lagreKandidaterTilStillingKnappTekst = (antall: number) => {
    if (antall === 0) {
        return 'Lagre kandidater i kandidatliste';
    } else if (antall === 1) {
        return 'Lagre 1 kandidat i kandidatliste';
    }
    return `Lagre ${antall} kandidater i kandidatliste`;
};

const markereKandidat = (kandidatnr: string, checked: boolean) => (k: CvSøkeresultat) => {
    if (k.arenaKandidatnr === kandidatnr) {
        return { ...k, markert: checked };
    }
    return k;
};

export type MarkerbartSøkeresultat = CvSøkeresultat & {
    markert?: boolean;
};

type Props = ConnectedProps & {
    skjulPaginering?: boolean;
    kandidatlisteId?: string;
    stillingsId?: string;
};

type ConnectedProps = {
    kandidater: MarkerbartSøkeresultat[];
    totaltAntallTreff: number;
    isEmptyQuery: boolean;
    isSearching: boolean;
    lastFlereKandidater: () => void;
    leggTilKandidatStatus: Nettstatus;
    searchQueryHash: string;
    antallKandidater: number;
    valgtKandidatNr: string;
    oppdaterAntallKandidater: (antall: number) => void;
    oppdaterMarkerteKandidater: (markerte: MarkerbartSøkeresultat[]) => void;
    leggTilKandidaterIKandidatliste: (
        kandidatliste: Kandidatliste,
        kandidater: KandidatOutboundDto[]
    ) => void;
    kandidatliste?: Kandidatliste;
};

type State = {
    alleKandidaterMarkert: boolean;
    lagreKandidaterModalVises: boolean;
    lagreKandidaterModalTilStillingVises: boolean;
    kandidater: MarkerbartSøkeresultat[];
};

class KandidaterOgModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            alleKandidaterMarkert:
                props.kandidater.filter((k, i) => i < props.antallKandidater && k.markert)
                    .length === Math.min(props.antallKandidater, props.kandidater.length),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            kandidater: props.kandidater,
        };
    }

    componentDidUpdate(prevProps: Props) {
        const { kandidater, antallKandidater, leggTilKandidatStatus } = this.props;
        const harNyeSokekriterier = this.props.searchQueryHash !== prevProps.searchQueryHash;
        if (harNyeSokekriterier) {
            this.setState({
                kandidater,
                alleKandidaterMarkert: false,
            });
        } else if (!harNyeSokekriterier && kandidater > prevProps.kandidater) {
            this.setState({
                kandidater,
            });
        } else if (prevProps.kandidater !== kandidater) {
            this.setState({
                kandidater,
                alleKandidaterMarkert:
                    kandidater.filter((k, i) => i < antallKandidater && k.markert).length ===
                    Math.min(antallKandidater, kandidater.length),
            });
        }
        if (
            prevProps.leggTilKandidatStatus !== leggTilKandidatStatus &&
            leggTilKandidatStatus === Nettstatus.Suksess
        ) {
            if (this.state.lagreKandidaterModalTilStillingVises) {
                this.lukkLagreKandidaterTilStillingModal();
            }
        }
    }

    onKandidatValgt = (checked: boolean, kandidatnr: string) => {
        this.props.oppdaterMarkerteKandidater(
            this.state.kandidater.map(markereKandidat(kandidatnr, checked))
        );

        this.setState({
            alleKandidaterMarkert: false,
        });
    };

    onFlereResultaterClick = () => {
        if (this.props.isSearching) {
            return;
        }
        const nyttAntall = Math.min(
            this.props.antallKandidater + KANDIDATLISTE_CHUNK_SIZE,
            this.props.totaltAntallTreff
        );
        if (nyttAntall > this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        if (nyttAntall !== this.props.antallKandidater) {
            this.props.oppdaterAntallKandidater(nyttAntall);
        }
        this.setState({
            alleKandidaterMarkert: false,
        });
    };

    onLagreKandidatliste = (kandidatliste: Kandidatliste) => {
        const kandidatnr = this.state.kandidater
            .filter((kandidat) => kandidat.markert)
            .map((kandidat) => ({
                kandidatnr: kandidat.arenaKandidatnr,
            }));

        this.props.leggTilKandidaterIKandidatliste(kandidatliste, kandidatnr);
    };

    onToggleMarkeringAlleKandidater = () => {
        const checked = !this.state.alleKandidaterMarkert;
        this.toggleMarkeringAlleKandidater(checked);
    };

    toggleMarkeringAlleKandidater = (checked) => {
        const kandidaterMedMarkering = this.state.kandidater.map((k, i) =>
            i < this.props.antallKandidater ? { ...k, markert: checked } : k
        );

        this.setState({
            alleKandidaterMarkert: checked,
        });

        this.props.oppdaterMarkerteKandidater(kandidaterMedMarkering);
    };

    åpneLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: true,
        });
    };

    lukkLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: false,
        });

        if (this.props.leggTilKandidatStatus === Nettstatus.Suksess) {
            this.toggleMarkeringAlleKandidater(false);
        }
    };

    åpneLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: true,
        });
    };

    lukkLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: false,
        });

        if (this.props.leggTilKandidatStatus === Nettstatus.Suksess) {
            this.toggleMarkeringAlleKandidater(false);
        }
    };

    render() {
        const {
            isEmptyQuery,
            kandidatliste,
            totaltAntallTreff,
            kandidatlisteId,
            stillingsId,
            antallKandidater,
            valgtKandidatNr,
        } = this.props;

        const {
            kandidater,
            lagreKandidaterModalVises,
            lagreKandidaterModalTilStillingVises,
            alleKandidaterMarkert,
        } = this.state;

        const panelTekst = isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';
        const antallMarkert = hentAntallMarkerteResultater(kandidater);

        return (
            <div>
                {lagreKandidaterModalVises && (
                    <LagreKandidaterModal
                        vis={lagreKandidaterModalVises}
                        onRequestClose={this.lukkLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                    />
                )}
                {lagreKandidaterModalTilStillingVises && kandidatliste && (
                    <LagreKandidaterTilStillingModal
                        vis={lagreKandidaterModalTilStillingVises}
                        onRequestClose={this.lukkLagreKandidaterTilStillingModal}
                        onLagre={this.onLagreKandidatliste}
                        antallMarkerteKandidater={antallMarkert}
                        kandidatliste={kandidatliste}
                        isSaving={this.props.leggTilKandidatStatus === Nettstatus.SenderInn}
                    />
                )}
                <div className="resultatvisning--header">
                    <Undertittel>
                        {formatterInt(totaltAntallTreff)} {panelTekst}
                    </Undertittel>
                    <KnappMedHjelpetekst
                        hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                        disabled={antallMarkert === 0}
                        onClick={
                            kandidatlisteId || stillingsId
                                ? this.åpneLagreKandidaterTilStillingModal
                                : this.åpneLagreKandidaterModal
                        }
                        id="lagre-kandidater-knapp"
                        tittel={lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                    >
                        {lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                    </KnappMedHjelpetekst>
                </div>
                <KandidaterTabell
                    skjulPaginering={this.props.skjulPaginering}
                    antallResultater={antallKandidater}
                    kandidater={kandidater}
                    onFlereResultaterClick={this.onFlereResultaterClick}
                    totaltAntallTreff={totaltAntallTreff}
                    onKandidatValgt={this.onKandidatValgt}
                    alleKandidaterMarkert={alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={this.onToggleMarkeringAlleKandidater}
                    valgtKandidatNr={valgtKandidatNr}
                    kandidatlisteId={kandidatlisteId}
                    stillingsId={stillingsId}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<KandidatlisteAction | KandidatsøkAction>) => ({
    leggTilKandidaterIKandidatliste: (
        kandidatliste: Kandidatliste,
        kandidater: KandidatOutboundDto[]
    ) => {
        dispatch({ type: KandidatlisteActionType.LeggTilKandidater, kandidatliste, kandidater });
    },
    lastFlereKandidater: () => {
        dispatch({ type: KandidatsøkActionType.LastFlereKandidater });
    },
    oppdaterAntallKandidater: (antallKandidater: number) => {
        dispatch({
            type: KandidatsøkActionType.OppdaterAntallKandidater,
            antall: antallKandidater,
        });
    },
    oppdaterMarkerteKandidater: (markerteKandidater: MarkerbartSøkeresultat[]) => {
        dispatch({ type: KandidatsøkActionType.MarkerKandidater, kandidater: markerteKandidater });
    },
});

const mapStateToProps = (state: AppState) => ({
    kandidater: state.søk.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.søk.isEmptyQuery,
    isSearching: state.søk.isSearching,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    searchQueryHash: state.søk.searchQueryHash,
    antallKandidater: state.søk.antallVisteKandidater,
    valgtKandidatNr: state.søk.valgtKandidatNr,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterOgModal);
