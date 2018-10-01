import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import cvPropTypes from '../PropTypes';
import KandidaterTabellUtenKriterier from './KandidaterTabellUtenKriterier';
import KandidaterTabellMedKriterier from './KandidaterTabellMedKriterier';
import './Resultat.less';
import ShowModalResultat from './modal/ShowModalResultat';
import KnappMedDisabledFunksjon from '../common/KnappMedDisabledFunksjon';

const lagreKandidaterKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre Kandidater';
    } else if (antall === 1) {
        return 'lagre 1 kandidat';
    }
    return `lagre ${antall} kandidater`;
};


class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallResultater: 25,
            kandidater: this.props.kandidater,
            valgteKandidater: []
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kandidater !== this.props.kandidater) {
        // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidater: this.props.kandidater,
                antallResultater: 25,
                valgteKandidater: []
            });
        }
    }

    onKandidatValgt = (checked, kandidatnr, sisteArbeidserfaring) => {
        if (checked) {
            this.setState({
                valgteKandidater: [...this.state.valgteKandidater, { kandidatnr, sisteArbeidserfaring }]
            });
        } else {
            this.setState({
                valgteKandidater: this.state.valgteKandidater.filter((k) => (k.kandidatnr !== kandidatnr))
            });
        }
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


    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';

        return (
            <div>
                <div className="panel resultatvisning">
                    <Ingress className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Ingress>
                    <KnappMedDisabledFunksjon disabled={this.state.valgteKandidater.length === 0} onClick={() => { console.log('Clicked!'); }} onDisabledClick={this.props.visFeilmelding} >
                        {lagreKandidaterKnappTekst(this.state.valgteKandidater.length)}
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
