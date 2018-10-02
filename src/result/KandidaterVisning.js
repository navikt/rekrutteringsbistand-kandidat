import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import cvPropTypes from '../PropTypes';
import KandidaterTabellUtenKriterier from './KandidaterTabellUtenKriterier';
import KandidaterTabellMedKriterier from './KandidaterTabellMedKriterier';
import './Resultat.less';
import ShowModalResultat from './modal/ShowModalResultat';
import KnappMedDisabledFunksjon from '../common/KnappMedDisabledFunksjon';

const antallKandidaterMarkert = (kandidater) => (
    kandidater.filter((k) => (k.markert)).length
);

const lagreKandidaterKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre Kandidater';
    } else if (antall === 1) {
        return 'lagre 1 kandidat';
    }
    return `lagre ${antall} kandidater`;
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
            alleKandidaterMarkert: false
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

    toggleMarkeringAlleKandidater = () => {
        const checked = !this.state.alleKandidaterMarkert;
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
                <div className="panel resultatvisning">
                    <Ingress className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Ingress>
                    <Checkbox className="text-hide" label="." checked={this.state.alleKandidaterMarkert} onChange={this.toggleMarkeringAlleKandidater} />
                    <KnappMedDisabledFunksjon disabled={antallMarkert === 0} onClick={() => { console.log('Clicked!'); }} onDisabledClick={this.props.visFeilmelding} >
                        {lagreKandidaterKnappTekst(antallMarkert)}
                    </KnappMedDisabledFunksjon>
                </div>

                {this.props.isEmptyQuery ? (

                    <KandidaterTabellUtenKriterier
                        antallResultater={this.state.antallResultater}
                        kandidater={this.state.kandidater}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFilterScoreClick={this.onFilterScoreClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}
                        onKandidatValgt={this.onKandidatValgt}

                    />

                ) : (

                    <KandidaterTabellMedKriterier
                        antallResultater={this.state.antallResultater}
                        kandidater={this.state.kandidater}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFilterScoreClick={this.onFilterScoreClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}
                        onKandidatValgt={this.onKandidatValgt}

                    />

                )}

                <ShowModalResultat />
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired,
    visFeilmelding: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery
});

export default connect(mapStateToProps)(KandidaterVisning);
