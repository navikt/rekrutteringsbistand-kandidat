/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { Row } from 'nav-frontend-grid';
import cvPropTypes from '../../felles/PropTypes';
import KandidaterTabell from './KandidaterTabell';
import './Resultat.less';
import { HENT_KANDIDATLISTE, LEGG_TIL_KANDIDATER } from '../kandidatlister/kandidatlisteReducer';
import { KANDIDATLISTE_CHUNK_SIZE, LAGRE_STATUS } from '../../felles/konstanter';
import KnappMedHjelpetekst from '../../felles/common/KnappMedHjelpetekst';
import { LAST_FLERE_KANDIDATER, MARKER_KANDIDATER, OPPDATER_ANTALL_KANDIDATER } from '../sok/searchReducer';
import LagreKandidaterTilStillingModal from '../../veileder/result/LagreKandidaterTilStillingModal';

const antallKandidaterMarkert = (kandidater) => (
    kandidater.filter((k) => (k.markert)).length
);

const lagreKandidaterTilStillingKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre kandidater til stilling';
    } else if (antall === 1) {
        return 'Lagre 1 kandidat til stilling';
    }
    return `Lagre ${antall} kandidater til stilling`;
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
            antallResultater: props.antallKandidater,
            alleKandidaterMarkert: props.kandidater.filter((k, i) => i < props.antallKandidater && k.markert).length === Math.min(props.antallKandidater, props.kandidater.length),
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
        const harNyeSokekriterier = (this.props.searchQueryHash !== prevProps.searchQueryHash);
        if (harNyeSokekriterier) {
            this.setState({
                kandidater: this.props.kandidater,
                alleKandidaterMarkert: false
            });
        } else if (!harNyeSokekriterier && this.props.kandidater > prevProps.kandidater) {
            this.setState({
                kandidater: this.props.kandidater,
                antallResultater: this.props.antallKandidater
            });
        } else if (prevProps.antallKandidater !== this.props.antallKandidater) {
            this.setState({
                antallResultater: this.props.antallKandidater
            });
        } else if (prevProps.kandidater !== this.props.kandidater) {
            this.setState({
                kandidater: this.props.kandidater
            });
        }
        if (prevProps.kandidatliste !== this.props.kandidatliste) {
            this.setState({
                kandidatlisteId: this.props.kandidatliste.kandidatlisteId
            });
        }
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterTilStillingModal();
            this.toggleMarkeringAlleKandidater(false);
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
        const nyttAntall = Math.min(this.state.antallResultater + KANDIDATLISTE_CHUNK_SIZE, this.props.totaltAntallTreff);
        if (nyttAntall > this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        if (nyttAntall !== this.state.antallResultater) {
            this.props.oppdaterAntallKandidater(nyttAntall);
        }
    };

    onFilterAntallArClick = (antallArChevronNed, from, to) => {
        const kandidater = this.state.kandidater.slice(from, to)
            .sort((kand1, kand2) => {
                if (antallArChevronNed) {
                    return kand1.totalLengdeYrkeserfaring - kand2.totalLengdeYrkeserfaring;
                }
                return kand2.totalLengdeYrkeserfaring - kand1.totalLengdeYrkeserfaring;
            });
        this.setState({
            kandidater: [
                ...this.state.kandidater.slice(0, from),
                ...kandidater,
                ...this.state.kandidater.slice(to)
            ]
        });
    };

    onLagreKandidatlister = (kandidatlisteIder) => {
        this.props.leggTilKandidaterIKandidatliste(this.state.kandidater
            .filter((kandidat) => (kandidat.markert))
            .map((kandidat) => ({
                kandidatnr: kandidat.arenaKandidatnr,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
            })), kandidatlisteIder);
    };

    onToggleMarkeringAlleKandidater = () => {
        const checked = !this.state.alleKandidaterMarkert;
        this.toggleMarkeringAlleKandidater(checked);
    };

    toggleMarkeringAlleKandidater = (checked) => {
        const markerteKandidater = this.state.kandidater.filter((kandidat, i) => i < this.state.antallResultater).map((k) => ({ ...k, markert: checked }));
        this.setState({
            alleKandidaterMarkert: checked
        });
        this.props.oppdaterMarkerteKandidater([...markerteKandidater, ...this.state.kandidater.filter((kandidat, i) => i >= this.state.antallResultater)]);
    };

    apneLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: true });
    };

    lukkeLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: false });
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';
        const antallMarkert = antallKandidaterMarkert(this.state.kandidater);

        return (
            <div>
                {this.state.lagreKandidaterModalTilStillingVises &&
                    <LagreKandidaterTilStillingModal
                        onRequestClose={this.lukkeLagreKandidaterTilStillingModal}
                        onLagre={this.onLagreKandidatlister}
                        antallMarkerteKandidater={antallMarkert}
                        kandidatlisteId={this.state.kandidatlisteId}
                    />
                }
                <Row className="resultatvisning">
                    <div className="resultatvisning--header">
                        <Undertittel className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Undertittel>
                        <KnappMedHjelpetekst
                            hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                            mini
                            type="hoved"
                            disabled={antallMarkert === 0}
                            onClick={this.apneLagreKandidaterTilStillingModal}
                            id="lagre-kandidater-knapp"
                        >
                            {lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                        </KnappMedHjelpetekst>
                    </div>
                </Row>
                <KandidaterTabell
                    antallResultater={this.state.antallResultater}
                    kandidater={this.state.kandidater}
                    onFilterAntallArClick={this.onFilterAntallArClick}
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
    }
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
    })
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => { dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder }); },
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
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
