import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Row } from 'nav-frontend-grid';
import cvPropTypes from '../../felles/PropTypes';
import KandidaterTabell from './KandidaterTabell';
import './Resultat.less';
import { LEGG_TIL_KANDIDATER } from '../kandidatlister/kandidatlisteReducer';
import LagreKandidaterModal from './LagreKandidaterModal';
import { LAGRE_STATUS, KANDIDATLISTE_CHUNK_SIZE } from '../../felles/konstanter';
import KnappMedHjelpetekst from '../../felles/common/KnappMedHjelpetekst';
import { LAST_FLERE_KANDIDATER, MARKER_KANDIDATER, OPPDATER_ANTALL_KANDIDATER } from '../sok/searchReducer';
import { USE_JANZZ } from '../common/fasitProperties';

const antallKandidaterMarkert = (kandidater) => (
    kandidater.filter((k) => (k.markert)).length
);

const lagreKandidaterKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre kandidater';
    } else if (antall === 1) {
        return 'Lagre 1 kandidat';
    }
    return `Lagre ${antall} kandidater`;
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
            lagreKandidaterModalVises: false,
            kandidater: props.kandidater
        };
    }

    componentDidMount() {
        setTimeout(() => {
            window.scrollTo(0, this.props.scrolletFraToppen);
        }, 10);
    }

    componentDidUpdate(prevProps) {
        const { kandidater, antallKandidater, searchQueryHash, leggTilKandidatStatus } = this.props;
        const harNyeSokekriterier = (searchQueryHash !== prevProps.searchQueryHash);
        if (harNyeSokekriterier) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidater,
                alleKandidaterMarkert: false
            });
        } else if (!harNyeSokekriterier && kandidater > prevProps.kandidater) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidater,
                antallResultater: antallKandidater
            });
        } else if (prevProps.antallKandidater !== antallKandidater) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                antallResultater: antallKandidater
            });
        } else if (prevProps.kandidater !== kandidater) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidater,
                alleKandidaterMarkert: kandidater.filter((k, i) => i < antallKandidater && k.markert).length === Math.min(antallKandidater, kandidater.length)
            });
        }
        if (prevProps.leggTilKandidatStatus !== leggTilKandidatStatus && leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
            this.toggleMarkeringAlleKandidater(false);
        }
    }

    onKandidatValgt = (checked, kandidatnr) => {
        this.props.oppdaterMarkerteKandidater(this.state.kandidater.map(markereKandidat(kandidatnr, checked)));
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
        this.setState({
            alleKandidaterMarkert: false
        });
    };

    onFilterScoreClick = (scoreChevronNed, from, to) => {
        const kandidater = this.state.kandidater.slice(from, to)
            .sort((kand1, kand2) => {
                const kand1score = kand1.score;
                const kand2score = kand2.score;
                if (scoreChevronNed) {
                    return kand1score - kand2score;
                }
                return kand2score - kand1score;
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

    aapneLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: true
        });
    };

    lukkeLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: false
        });
    };

    toggleMarkeringAlleKandidater = (checked) => {
        const markerteKandidater = this.state.kandidater.filter((kandidat, i) => i < this.state.antallResultater).map((k) => ({ ...k, markert: checked }));
        this.setState({
            alleKandidaterMarkert: checked
        });
        this.props.oppdaterMarkerteKandidater([...markerteKandidater, ...this.state.kandidater.filter((kandidat, i) => i >= this.state.antallResultater)]);
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';

        if (this.props.isSearching && USE_JANZZ) {
            return (
                <div>
                    <div className="panel resultatvisning">
                        <Ingress className="text--left inline">Oppdaterer resultatet <NavFrontendSpinner type="S" className="spinner--center" /></Ingress>
                    </div>
                </div>
            );
        }

        const antallMarkert = antallKandidaterMarkert(this.state.kandidater);
        return (
            <div>
                {this.state.lagreKandidaterModalVises && <LagreKandidaterModal onRequestClose={this.lukkeLagreKandidaterModal} onLagre={this.onLagreKandidatlister} />}

                <Row className="resultatvisning">
                    <div className="resultatvisning--header">
                        <Undertittel className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Undertittel>
                        <KnappMedHjelpetekst
                            hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                            mini
                            type="hoved"
                            disabled={antallMarkert === 0}
                            onClick={this.aapneLagreKandidaterModal}
                            id="lagre-kandidater-knapp"
                            tittel={lagreKandidaterKnappTekst(antallMarkert)}
                        >
                            {lagreKandidaterKnappTekst(antallMarkert)}
                        </KnappMedHjelpetekst>
                    </div>
                </Row>
                <KandidaterTabell
                    antallResultater={this.state.antallResultater}
                    kandidater={this.state.kandidater}
                    onFilterScoreClick={this.onFilterScoreClick}
                    onFlereResultaterClick={this.onFlereResultaterClick}
                    totaltAntallTreff={this.props.totaltAntallTreff}
                    onKandidatValgt={this.onKandidatValgt}
                    alleKandidaterMarkert={this.state.alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={this.onToggleMarkeringAlleKandidater}
                    valgtKandidatNr={this.props.valgtKandidatNr}
                />
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    lastFlereKandidater: PropTypes.func.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    searchQueryHash: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    scrolletFraToppen: PropTypes.number.isRequired,
    oppdaterAntallKandidater: PropTypes.func.isRequired,
    oppdaterMarkerteKandidater: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => {
        dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder });
    },
    lastFlereKandidater: () => {
        dispatch({ type: LAST_FLERE_KANDIDATER });
    },
    oppdaterAntallKandidater: (antallKandidater) => {
        dispatch({ type: OPPDATER_ANTALL_KANDIDATER, antall: antallKandidater });
    },
    oppdaterMarkerteKandidater: (markerteKandidater) => {
        dispatch({ type: MARKER_KANDIDATER, kandidater: markerteKandidater });
    }
});

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery,
    isSearching: state.search.isSearching,
    kandidatlister: state.kandidatlister.kandidatlister,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    searchQueryHash: state.search.searchQueryHash,
    antallKandidater: state.search.antallVisteKandidater,
    valgtKandidatNr: state.search.valgtKandidatNr,
    scrolletFraToppen: state.search.scrolletFraToppen
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
