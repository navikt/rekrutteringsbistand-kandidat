/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import cvPropTypes from '../../felles/PropTypes';
import KandidaterTabell from './KandidaterTabell';
import './Resultat.less';
import { HENT_KANDIDATLISTE, LEGG_TIL_KANDIDATER } from '../kandidatlister/kandidatlisteReducer';
import { KANDIDATLISTE_CHUNK_SIZE, LAGRE_STATUS } from '../../felles/konstanter';
import KnappMedHjelpetekst from '../../felles/common/KnappMedHjelpetekst';
import { LAST_FLERE_KANDIDATER, MARKER_KANDIDATER, OPPDATER_ANTALL_KANDIDATER } from '../sok/searchReducer';
import LagreKandidaterTilStillingModal from '../../veileder/result/LagreKandidaterTilStillingModal';
import LagreKandidaterModal from '../../veileder/result/LagreKandidaterModal';

const antallKandidaterMarkert = (kandidater) => (
    kandidater.filter((k) => (k.markert)).length
);

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
            alleKandidaterMarkert: props.kandidater.filter((k, i) => i < props.antallKandidater && k.markert).length === Math.min(props.antallKandidater, props.kandidater.length),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            kandidater: props.kandidater,
            kandidatlisteId: undefined
        };
    }

    componentDidMount() {
        if (this.props.stillingsId) {
            this.props.hentKandidatliste(this.props.stillingsId);
        }
        setTimeout(() => {
            window.scrollTo(0, this.props.scrolletFraToppen);
        }, 10);
    }

    componentDidUpdate(prevProps) {
        const { kandidater, kandidatliste, antallKandidater, leggTilKandidatStatus } = this.props;
        const harNyeSokekriterier = (this.props.searchQueryHash !== prevProps.searchQueryHash);
        if (harNyeSokekriterier) {
            this.setState({
                kandidater,
                alleKandidaterMarkert: false
            });
        } else if (!harNyeSokekriterier && kandidater > prevProps.kandidater) {
            this.setState({
                kandidater
            });
        } else if (prevProps.kandidater !== kandidater) {
            this.setState({
                kandidater,
                alleKandidaterMarkert: kandidater.filter((k, i) => i < antallKandidater && k.markert).length === Math.min(antallKandidater, kandidater.length)
            });
        }
        if (prevProps.kandidatliste !== kandidatliste) {
            this.setState({
                kandidatlisteId: kandidatliste.kandidatlisteId
            });
        }
        if (prevProps.leggTilKandidatStatus !== leggTilKandidatStatus && leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.setState({ lagreKandidaterModalTilStillingVises: false });
        }
    }

    onKandidatValgt = (checked, kandidatnr) => {
        this.props.oppdaterMarkerteKandidater(this.state.kandidater.map(markereKandidat(kandidatnr, checked)));
        this.setState({
            alleKandidaterMarkert: false
        });
    };

    onFlereResultaterClick = () => {
        if (this.props.isSearching) {
            return;
        }
        const nyttAntall = Math.min(this.props.antallKandidater + KANDIDATLISTE_CHUNK_SIZE, this.props.totaltAntallTreff);
        if (nyttAntall > this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        if (nyttAntall !== this.props.antallKandidater) {
            this.props.oppdaterAntallKandidater(nyttAntall);
        }
        this.setState({
            alleKandidaterMarkert: false
        });
    };

    onLagreKandidatliste = (kandidatliste) => {
        this.props.leggTilKandidaterIKandidatliste(kandidatliste, this.state.kandidater
            .filter((kandidat) => (kandidat.markert))
            .map((kandidat) => ({
                kandidatnr: kandidat.arenaKandidatnr,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
            }))
        );
    };

    onToggleMarkeringAlleKandidater = () => {
        const checked = !this.state.alleKandidaterMarkert;
        this.toggleMarkeringAlleKandidater(checked);
    };

    toggleMarkeringAlleKandidater = (checked) => {
        const kandidaterMedMarkering = this.state.kandidater.map((k, i) => (i < this.props.antallKandidater ? { ...k, markert: checked } : k));

        this.setState({
            alleKandidaterMarkert: checked
        });

        this.props.oppdaterMarkerteKandidater(kandidaterMedMarkering);
    };

    toggleLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: !this.state.lagreKandidaterModalVises
        });
    };

    toggleLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: !this.state.lagreKandidaterModalTilStillingVises
        });
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';
        const antallMarkert = antallKandidaterMarkert(this.state.kandidater);

        return (
            <div>
                {this.state.lagreKandidaterModalVises &&
                <LagreKandidaterModal
                    vis={this.state.lagreKandidaterModalVises}
                    onRequestClose={this.toggleLagreKandidaterModal}
                    onLagre={this.onLagreKandidatliste}
                    antallMarkerteKandidater={antallMarkert}
                />
                }
                {this.state.lagreKandidaterModalTilStillingVises &&
                <LagreKandidaterTilStillingModal
                    vis={this.state.lagreKandidaterModalTilStillingVises}
                    onRequestClose={this.toggleLagreKandidaterTilStillingModal}
                    onLagre={this.onLagreKandidatliste}
                    antallMarkerteKandidater={antallMarkert}
                    kandidatliste={this.props.kandidatliste}
                    stillingsoverskrift={this.props.stillingsoverskrift}
                />
                }
                <div className="resultatvisning--header">
                    <Undertittel className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Undertittel>
                    <KnappMedHjelpetekst
                        hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                        mini
                        type="hoved"
                        disabled={antallMarkert === 0}
                        onClick={this.props.stillingsId ? this.toggleLagreKandidaterTilStillingModal : this.toggleLagreKandidaterModal}
                        id="lagre-kandidater-knapp"
                        tittel={lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                    >
                        {lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                    </KnappMedHjelpetekst>
                </div>
                <KandidaterTabell
                    antallResultater={this.props.antallKandidater}
                    kandidater={this.state.kandidater}
                    onFlereResultaterClick={this.onFlereResultaterClick}
                    totaltAntallTreff={this.props.totaltAntallTreff}
                    onKandidatValgt={this.onKandidatValgt}
                    alleKandidaterMarkert={this.state.alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={this.onToggleMarkeringAlleKandidater}
                    valgtKandidatNr={this.props.valgtKandidatNr}
                    stillingsId={this.props.stillingsId}
                />
            </div>
        );
    }
}

KandidaterVisning.defaultProps = {
    stillingsId: undefined,
    kandidatliste: {
        kandidatlisteId: undefined
    },
    stillingsoverskrift: undefined
};

KandidaterVisning.propTypes = {
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
    stillingsId: PropTypes.string,
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string
    }),
    stillingsoverskrift: PropTypes.string
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidatliste, kandidater) => { dispatch({ type: LEGG_TIL_KANDIDATER, kandidatliste, kandidater }); },
    lastFlereKandidater: () => { dispatch({ type: LAST_FLERE_KANDIDATER }); },
    oppdaterAntallKandidater: (antallKandidater) => { dispatch({ type: OPPDATER_ANTALL_KANDIDATER, antall: antallKandidater }); },
    oppdaterMarkerteKandidater: (markerteKandidater) => { dispatch({ type: MARKER_KANDIDATER, kandidater: markerteKandidater }); },
    hentKandidatliste: (stillingsId) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer: stillingsId }); }
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
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    stillingsoverskrift: state.search.stillingsoverskrift
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
