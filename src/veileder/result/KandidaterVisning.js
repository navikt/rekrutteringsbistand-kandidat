/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import cvPropTypes from '../../felles/PropTypes';
import { Kandidatliste } from '../kandidatlister/PropTypes';
import KandidaterTabell from './kandidater-tabell/KandidaterTabell';
import './Resultat.less';
import { KANDIDATLISTE_CHUNK_SIZE, LAGRE_STATUS } from '../../felles/konstanter';
import KnappMedHjelpetekst from './knappMedHjelpetekst/KnappMedHjelpetekst';
import {
    LAST_FLERE_KANDIDATER,
    MARKER_KANDIDATER,
    OPPDATER_ANTALL_KANDIDATER, SEARCH,
} from '../sok/searchReducer';
import LagreKandidaterTilStillingModal from '../../veileder/result/LagreKandidaterTilStillingModal';
import LagreKandidaterModal from '../../veileder/result/LagreKandidaterModal';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import { formatterInt } from '../../felles/sok/utils';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { logEvent } from '../amplitude/amplitude';

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

class KandidaterVisning extends React.Component {
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
                logEvent(
                    'kandidatsøk',
                    'fra_midlertidig_utilgjengelig',
                    Date.now() - props.midlertidigUtilgjengeligEndretTidspunkt
                );
            }
        }
    }

    componentDidMount() {
        if (this.props.kandidatlisteId) {
            this.props.hentKandidatlisteMedKandidatlisteId(this.props.kandidatlisteId);
        }
        if (this.props.stillingsId) {
            this.props.hentKandidatlisteMedStillingsId(this.props.stillingsId);
        }
        setTimeout(() => {
            window.scrollTo(0, this.props.scrolletFraToppen);
        }, 10);
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
            this.setState({ lagreKandidaterModalTilStillingVises: false });
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
        this.props.leggTilKandidaterIKandidatliste(
            kandidatliste,
            this.state.kandidater
                .filter((kandidat) => kandidat.markert)
                .map((kandidat) => ({
                    kandidatnr: kandidat.arenaKandidatnr,
                    sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring
                        ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel
                        : '',
                }))
        );
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

    toggleLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: !this.state.lagreKandidaterModalVises,
        });
    };

    toggleLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: !this.state.lagreKandidaterModalTilStillingVises,
        });
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
                        onRequestClose={this.toggleLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                    />
                )}
                {lagreKandidaterModalTilStillingVises && (
                    <LagreKandidaterTilStillingModal
                        vis={lagreKandidaterModalTilStillingVises}
                        onRequestClose={this.toggleLagreKandidaterTilStillingModal}
                        onLagre={this.onLagreKandidatliste}
                        antallMarkerteKandidater={antallMarkert}
                        kandidatliste={kandidatliste}
                        isSaving={this.props.leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                    />
                )}
                <div className="resultatvisning--header">
                    <Undertittel className="text--left inline">
                        <strong id="antall-kandidater-treff">
                            {formatterInt(totaltAntallTreff)}
                        </strong>
                        {panelTekst}
                    </Undertittel>
                    <KnappMedHjelpetekst
                        hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                        disabled={antallMarkert === 0}
                        onClick={
                            kandidatlisteId || stillingsId
                                ? this.toggleLagreKandidaterTilStillingModal
                                : this.toggleLagreKandidaterModal
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

KandidaterVisning.defaultProps = {
    kandidatlisteId: undefined,
    stillingsId: undefined,
    kandidatliste: undefined,
    skjulPaginering: false,
};

KandidaterVisning.propTypes = {
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
    scrolletFraToppen: PropTypes.number.isRequired,
    oppdaterAntallKandidater: PropTypes.func.isRequired,
    oppdaterMarkerteKandidater: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string,
    stillingsId: PropTypes.string,
    hentKandidatlisteMedKandidatlisteId: PropTypes.func.isRequired,
    hentKandidatlisteMedStillingsId: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape(Kandidatliste),
    midlertidigUtilgjengeligEndretTidspunkt: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidatliste, kandidater) => {
        dispatch({ type: KandidatlisteActionType.LEGG_TIL_KANDIDATER, kandidatliste, kandidater });
    },
    lastFlereKandidater: () => {
        dispatch({ type: LAST_FLERE_KANDIDATER });
    },
    oppdaterAntallKandidater: (antallKandidater) => {
        dispatch({ type: OPPDATER_ANTALL_KANDIDATER, antall: antallKandidater });
    },
    oppdaterMarkerteKandidater: (markerteKandidater) => {
        dispatch({ type: MARKER_KANDIDATER, kandidater: markerteKandidater });
    },
    hentKandidatlisteMedKandidatlisteId: (kandidatlisteId) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        });
    },
    hentKandidatlisteMedStillingsId: (stillingsId) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        });
    },
});

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery,
    isSearching: state.search.isSearching,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    searchQueryHash: state.search.searchQueryHash,
    antallKandidater: state.search.antallVisteKandidater,
    valgtKandidatNr: state.search.valgtKandidatNr,
    scrolletFraToppen: state.search.scrolletFraToppen,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    midlertidigUtilgjengeligEndretTidspunkt: state.midlertidigUtilgjengelig.endretTidspunkt,
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
