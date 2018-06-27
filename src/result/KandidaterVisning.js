import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import { cvPropTypes } from '../PropTypes';
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

    onFilterUtdanningClick = (utdanningChevronNed, from, to) => {
        const kandidater = this.state.kandidater.slice(from, to)
            .sort((kand1, kand2) => {
                const kand1utd = kand1.hoyesteUtdanning ? kand1.hoyesteUtdanning.nusKode : 0;
                const kand2utd = kand2.hoyesteUtdanning ? kand2.hoyesteUtdanning.nusKode : 0;
                if (utdanningChevronNed) {
                    return kand1utd - kand2utd;
                }
                return kand2utd - kand1utd;
            });

        this.setState({
            kandidater: [
                ...this.state.kandidater.slice(0, from),
                ...kandidater,
                ...this.state.kandidater.slice(to)
            ]
        });
    };

    onFilterJobberfaringClick = (jobberfaringChevronNed, from, to) => {
        const kandidater = this.state.kandidater.slice(from, to)
            .sort((kand1, kand2) => {
                const kand1job = kand1.mestRelevanteYrkeserfaring ? kand1.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
                const kand2job = kand2.mestRelevanteYrkeserfaring ? kand2.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
                if (kand1job < kand2job) {
                    return jobberfaringChevronNed ? 1 : -1;
                } else if (kand1job > kand2job) {
                    return jobberfaringChevronNed ? -1 : 1;
                }
                return 0;
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
                        onFilterUtdanningClick={this.onFilterUtdanningClick}
                        onFilterJobberfaringClick={this.onFilterJobberfaringClick}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}

                    />

                ) : (

                    <KandidaterTabellMedKriterier
                        antallResultater={this.state.antallResultater}
                        kandidater={this.state.kandidater}
                        onFilterUtdanningClick={this.onFilterUtdanningClick}
                        onFilterJobberfaringClick={this.onFilterJobberfaringClick}
                        onFilterAntallArClick={this.onFilterAntallArClick}
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
