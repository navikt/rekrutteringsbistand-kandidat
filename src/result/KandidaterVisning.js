import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import cvPropTypes from '../PropTypes';
import KandidaterTabellUtenKriterier from './KandidaterTabellUtenKriterier';
import KandidaterTabellMedKriterier from './KandidaterTabellMedKriterier';
import './Resultat.less';
import ShowModalResultat from './modal/ShowModalResultat';


class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallResultater: 25,
            kandidater: this.props.kandidater
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            kandidater: nextProps.kandidater,
            antallResultater: 25
        });
    }

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
                </div>
                {this.props.isEmptyQuery ? (

                    <KandidaterTabellUtenKriterier
                        antallResultater={this.state.antallResultater}
                        kandidater={this.state.kandidater}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFilterScoreClick={this.onFilterScoreClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}

                    />

                ) : (

                    <KandidaterTabellMedKriterier
                        antallResultater={this.state.antallResultater}
                        kandidater={this.state.kandidater}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFilterScoreClick={this.onFilterScoreClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}

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
    isEmptyQuery: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery
});

export default connect(mapStateToProps)(KandidaterVisning);
