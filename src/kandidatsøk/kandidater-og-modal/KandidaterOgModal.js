/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import cvPropTypes from '../../common/PropTypes';
import { Kandidatliste } from '../../kandidatliste/PropTypes';
import KandidaterTabell from '../kandidater-tabell/KandidaterTabell';
import { KANDIDATLISTE_CHUNK_SIZE, LAGRE_STATUS } from '../../common/konstanter';
import KnappMedHjelpetekst from '../knappMedHjelpetekst/KnappMedHjelpetekst';
import { KandidatsøkActionType } from '../reducer/searchActions';
import LagreKandidaterTilStillingModal from '../modaler/LagreKandidaterTilStillingModal';
import LagreKandidaterModal from '../modaler/LagreKandidaterModal';
import { Nettstatus } from '../../api/remoteData.ts';
import { formatterInt } from '../utils';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { sendEvent } from '../../amplitude/amplitude';

const antallKandidaterMarkert = (kandidater) => kandidater.filter((k) => k.markert).length;

const lagreKandidaterTilStillingKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre kandidater i kandidatliste';
    } else if (antall === 1) {
        return 'Lagre 1 kandidat i kandidatliste';
    }
    return `Lagre ${antall} kandidater i kandidatliste`;
};

const markereKandidat = (kandidatnr, checked) => (k) => {
    if (k.arenaKandidatnr === kandidatnr) {
        return { ...k, markert: checked };
    }
    return k;
};

class KandidaterOgModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleKandidaterMarkert:
                props.kandidater.filter((k, i) => i < props.antallKandidater && k.markert)
                    .length === Math.min(props.antallKandidater, props.kandidater.length),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            kandidater: props.kandidater,
        };
        if (props.midlertidigUtilgjengeligEndretTidspunkt) {
            const tid = Date.now() - props.midlertidigUtilgjengeligEndretTidspunkt;
            if (tid < 10000) {
                sendEvent('kandidatsøk', 'fra_midlertidig_utilgjengelig', { tid: tid });
            }
        }
    }

    componentDidUpdate(prevProps) {
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
            leggTilKandidatStatus === LAGRE_STATUS.SUCCESS
        ) {
            if (this.state.lagreKandidaterModalTilStillingVises) {
                this.lukkLagreKandidaterTilStillingModal();
            }
        }
    }

    onKandidatValgt = (checked, kandidatnr) => {
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

    onLagreKandidatliste = (kandidatliste) => {
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

        if (this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
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

        if (this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
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
        const antallMarkert = antallKandidaterMarkert(kandidater);

        return (
            <div>
                {lagreKandidaterModalVises && (
                    <LagreKandidaterModal
                        vis={lagreKandidaterModalVises}
                        onRequestClose={this.lukkLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                    />
                )}
                {lagreKandidaterModalTilStillingVises && (
                    <LagreKandidaterTilStillingModal
                        vis={lagreKandidaterModalTilStillingVises}
                        onRequestClose={this.lukkLagreKandidaterTilStillingModal}
                        onLagre={this.onLagreKandidatliste}
                        antallMarkerteKandidater={antallMarkert}
                        kandidatliste={kandidatliste}
                        isSaving={this.props.leggTilKandidatStatus === LAGRE_STATUS.LOADING}
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

KandidaterOgModal.defaultProps = {
    kandidatlisteId: undefined,
    stillingsId: undefined,
    kandidatliste: undefined,
    skjulPaginering: false,
};

KandidaterOgModal.propTypes = {
    skjulPaginering: PropTypes.bool,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    lastFlereKandidater: PropTypes.func.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    searchQueryHash: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    oppdaterAntallKandidater: PropTypes.func.isRequired,
    oppdaterMarkerteKandidater: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string,
    stillingsId: PropTypes.string,
    kandidatliste: PropTypes.shape(Kandidatliste),
    midlertidigUtilgjengeligEndretTidspunkt: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidatliste, kandidater) => {
        dispatch({ type: KandidatlisteActionType.LeggTilKandidater, kandidatliste, kandidater });
    },
    lastFlereKandidater: () => {
        dispatch({ type: KandidatsøkActionType.LastFlereKandidater });
    },
    oppdaterAntallKandidater: (antallKandidater) => {
        dispatch({
            type: KandidatsøkActionType.OppdaterAntallKandidater,
            antall: antallKandidater,
        });
    },
    oppdaterMarkerteKandidater: (markerteKandidater) => {
        dispatch({ type: KandidatsøkActionType.MarkerKandidater, kandidater: markerteKandidater });
    },
});

const mapStateToProps = (state) => ({
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
    midlertidigUtilgjengeligEndretTidspunkt: state.midlertidigUtilgjengelig.endretTidspunkt,
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterOgModal);
