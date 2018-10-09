import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import cvPropTypes from '../PropTypes';
import KandidaterTabell from './KandidaterTabell';
import './Resultat.less';
import { LEGG_TIL_KANDIDATER } from '../kandidatlister/kandidatlisteReducer';
import LagreKandidaterModal from './LagreKandidaterModal';
import { LAGRE_STATUS } from '../konstanter';
import KnappMedHjelpetekst from '../common/KnappMedHjelpetekst';

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

const avmarkerKandidat = (k) => ({ ...k, markert: false });

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
            antallResultater: 25,
            kandidater: this.props.kandidater.map(avmarkerKandidat),
            alleKandidaterMarkert: false,
            lagreKandidaterModalVises: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kandidater !== this.props.kandidater) {
        // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidater: this.props.kandidater.map(avmarkerKandidat),
                antallResultater: 25,
                alleKandidaterMarkert: false
            });
        }
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
            this.toggleMarkeringAlleKandidater(false);
        }
    }

    onKandidatValgt = (checked, kandidatnr) => {
        this.setState({
            kandidater: this.state.kandidater.map(markereKandidat(kandidatnr, checked)),
            alleKandidaterMarkert: false
        });
    };

    onFlereResultaterClick = () => {
        this.setState({
            antallResultater: this.state.antallResultater > 80 ? 100 : this.state.antallResultater + 20
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
        this.setState({
            alleKandidaterMarkert: checked,
            kandidater: this.state.kandidater.map((k) => ({ ...k, markert: checked }))
        });
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';

        const antallMarkert = antallKandidaterMarkert(this.state.kandidater);
        return (
            <div>
                {this.state.lagreKandidaterModalVises && <LagreKandidaterModal onRequestClose={this.lukkeLagreKandidaterModal} onLagre={this.onLagreKandidatlister} />}

                <div className="panel resultatvisning">
                    <div className="resultatvisning--header">
                        <Ingress className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Ingress>
                        {this.props.visKandidatlister &&
                            <KnappMedHjelpetekst
                                hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                                mini
                                type="hoved"
                                disabled={antallMarkert === 0}
                                onClick={this.aapneLagreKandidaterModal}
                            >
                                {lagreKandidaterKnappTekst(antallMarkert)}
                            </KnappMedHjelpetekst>
                        }
                    </div>
                </div>
                <KandidaterTabell
                    antallResultater={this.state.antallResultater}
                    kandidater={this.state.kandidater}
                    onFilterAntallArClick={this.onFilterAntallArClick}
                    onFilterScoreClick={this.onFilterScoreClick}
                    onFlereResultaterClick={this.onFlereResultaterClick}
                    totaltAntallTreff={this.props.totaltAntallTreff}
                    onKandidatValgt={this.onKandidatValgt}
                    alleKandidaterMarkert={this.state.alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={this.onToggleMarkeringAlleKandidater}
                />
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    visKandidatlister: PropTypes.bool.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => {
        dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder });
    }
});

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery,
    kandidatlister: state.kandidatlister.kandidatlister,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
