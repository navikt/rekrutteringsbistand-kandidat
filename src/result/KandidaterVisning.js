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
            cver: this.props.cver
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cver: nextProps.cver,
            antallResultater: 25
        });
    }

    onFlereResultaterClick = () => {
        this.setState({
            antallResultater: this.state.antallResultater > 80 ? 100 : this.state.antallResultater + 20
        });
    };

    onFilterUtdanningClick = (utdanningChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to)
            .sort((cv1, cv2) => {
                const cv1utd = cv1.hoyesteUtdanning ? cv1.hoyesteUtdanning.nusKode : 0;
                const cv2utd = cv2.hoyesteUtdanning ? cv2.hoyesteUtdanning.nusKode : 0;
                if (utdanningChevronNed) {
                    return cv1utd - cv2utd;
                }
                return cv2utd - cv1utd;
            });

        this.setState({
            cver: [
                ...this.state.cver.slice(0, from),
                ...cver,
                ...this.state.cver.slice(to)
            ]
        });
    };

    onFilterJobberfaringClick = (jobberfaringChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to)
            .sort((cv1, cv2) => {
                const cv1job = cv1.mestRelevanteYrkeserfaring ? cv1.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
                const cv2job = cv2.mestRelevanteYrkeserfaring ? cv2.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
                if (cv1job < cv2job) {
                    return jobberfaringChevronNed ? 1 : -1;
                } else if (cv1job > cv2job) {
                    return jobberfaringChevronNed ? -1 : 1;
                }
                return 0;
            });

        this.setState({
            cver: [
                ...this.state.cver.slice(0, from),
                ...cver,
                ...this.state.cver.slice(to)
            ]
        });
    };

    onFilterAntallArClick = (antallArChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to)
            .sort((cv1, cv2) => {
                if (antallArChevronNed) {
                    return cv1.totalLengdeYrkeserfaring - cv2.totalLengdeYrkeserfaring;
                }
                return cv2.totalLengdeYrkeserfaring - cv1.totalLengdeYrkeserfaring;
            });
        this.setState({
            cver: [
                ...this.state.cver.slice(0, from),
                ...cver,
                ...this.state.cver.slice(to)
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
                        cver={this.state.cver}
                        onFilterUtdanningClick={this.onFilterUtdanningClick}
                        onFilterJobberfaringClick={this.onFilterJobberfaringClick}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        onFlereResultaterClick={this.onFlereResultaterClick}
                        totaltAntallTreff={this.props.totaltAntallTreff}

                    />

                ) : (

                    <KandidaterTabellMedKriterier
                        antallResultater={this.state.antallResultater}
                        cver={this.state.cver}
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
    cver: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    cver: state.search.searchResultat.resultat.cver,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery
});

export default connect(mapStateToProps)(KandidaterVisning);
