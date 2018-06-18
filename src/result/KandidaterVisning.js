import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress } from 'nav-frontend-typografi';
import { cvPropTypes } from '../PropTypes';
import sortByDato from '../common/SortByDato';
import KandidaterTabellUtenKriterier from './KandidaterTabellUtenKriterier';
import KandidaterTabellMedKriterier from './KandidaterTabellMedKriterier';
import './Resultat.less';


class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallResultater: 25,
            cver: this.sortCvList(this.props.cver)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cver: this.sortCvList(nextProps.cver),
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
                const cv1utd = cv1.utdanning[0] ? cv1.utdanning[0].nusKode : 0;
                const cv2utd = cv2.utdanning[0] ? cv2.utdanning[0].nusKode : 0;
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
                const cv1job = cv1.yrkeserfaring[0] ? cv1.yrkeserfaring[0].styrkKodeStillingstittel : '';
                const cv2job = cv2.yrkeserfaring[0] ? cv2.yrkeserfaring[0].styrkKodeStillingstittel : '';
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

    swapJobberfaringer = (jobberfaring, int1, int2) => {
        let i = int2;
        while (i > int1) {
            jobberfaring.splice(i - 1, 0, jobberfaring.splice(i, 1)
                .pop());
            i -= 1;
        }
    };

    sortCvList = (cver) => {
        cver.forEach((cv) => {
            // Sortere utdanning slik at høyest oppnådd utdanning vises i resultat-listen,
            // og at det er denne det filtreres på.
            cv.utdanning.sort((cv1, cv2) => cv2.nusKode - cv1.nusKode);

            // Finne finne jobberfaring i CV som er relevant ut fra søkekriteriene for
            // arbeidserfaring og stilling. Er det flere relevante jobberfaringer vises den siste
            // eslint-disable-next-line no-param-reassign
            cv.yrkeserfaring = sortByDato(cv.yrkeserfaring);
            const erfaringer = cv.yrkeserfaring.map((y) =>
                this.props.arbeidserfaringer.concat(this.props.stillinger)
                    .find((a) => y.styrkKodeStillingstittel.toLowerCase() === a.toLowerCase()));
            const erfaring = erfaringer.find((e) => e !== undefined);
            if (erfaring) {
                const index = erfaringer.indexOf(erfaring);
                this.swapJobberfaringer(cv.yrkeserfaring, 0, index);
            }
        });
        return cver;
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';

        return (
            <div>
                <div className="panel resultatvisning">
                    <Ingress className="text--left inline"><strong>{this.props.totaltAntallTreff}</strong>{panelTekst}</Ingress>
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

            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    cver: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    arbeidserfaringer: PropTypes.arrayOf(PropTypes.string).isRequired,
    stillinger: PropTypes.arrayOf(PropTypes.string).isRequired,
    isEmptyQuery: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    cver: state.search.elasticSearchResultat.resultat.cver,
    totaltAntallTreff: state.search.elasticSearchResultat.resultat.totaltAntallTreff,
    arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
    stillinger: state.stilling.stillinger,
    isEmptyQuery: state.search.isEmptyQuery
});

export default connect(mapStateToProps)(KandidaterVisning);
