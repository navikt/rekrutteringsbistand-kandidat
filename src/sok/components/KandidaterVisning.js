import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import KandidaterTableHeader from './KandidaterTableHeader';
import KandidaterTableRow from './KandidaterTableRow';
import { cvPropTypes } from '../../PropTypes';
import sortByDato from '../../common/SortByDato';

class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallResultater: 20,
            cver: this.sortCvList(this.props.cver)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cver: this.sortCvList(nextProps.cver),
            antallResultater: 20
        });
    }

    onFlereResultaterClick = () => {
        this.setState({
            antallResultater: this.state.antallResultater + 15
        });
    };

    onFilterUtdanningClick = (utdanningChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
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
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
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
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
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
            jobberfaring.splice(i - 1, 0, jobberfaring.splice(i, 1).pop());
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
            cv.yrkeserfaring = sortByDato(cv.yrkeserfaring);
            const erfaringer = cv.yrkeserfaring.map((y) =>
                this.props.query.arbeidserfaringer.concat(this.props.query.stillinger)
                    .find((a) => y.styrkKodeStillingstittel.toLowerCase() === a.toLowerCase()));
            const erfaring = erfaringer.reverse()
                .find((e) => e !== undefined);
            if (erfaring) {
                const index = erfaringer.reverse()
                    .indexOf(erfaring);
                this.swapJobberfaringer(cv.yrkeserfaring, 0, index);
            }
        });
        return cver;
    };

    render() {
        let tittel = '';
        if (this.props.totaltAntallTreff > 5) {
            tittel = 'Topp 5 kandidater';
        } else if (this.props.totaltAntallTreff === 0) {
            tittel = 'Ingen direkte treff';
        } else if (this.props.totaltAntallTreff === 1) {
            tittel = 'Beste kandidat';
        } else {
            tittel = `Topp ${this.props.totaltAntallTreff} kandidater`;
        }
        return (
            <div>
                <Row className="panel resultatvisning">
                    <Column xs="6" md="6">
                        <Ingress className="text--left"><strong>{this.props.totaltAntallTreff}</strong> treff på aktuelle kandidater</Ingress>
                    </Column>
                    <Column xs="6" md="6">
                        <a href="#" className="lenke lenke--lagre--sok">Lagre søk og liste over kandidater</a>
                    </Column>
                </Row>
                <div className="resultatvisning">
                    <Systemtittel>{tittel}</Systemtittel>
                    <KandidaterTableHeader
                        onFilterUtdanningClick={this.onFilterUtdanningClick}
                        onFilterJobberfaringClick={this.onFilterJobberfaringClick}
                        onFilterAntallArClick={this.onFilterAntallArClick}
                        from={0}
                        to={5}
                    />
                    {this.state.cver.slice(0, 5).map((cv) => (
                        <KandidaterTableRow
                            cv={cv}
                            key={cv.arenaKandidatnr}
                        />
                    ))}
                </div>
                {this.state.cver.length > 5 && (
                    <div className="resultatvisning">
                        <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                        <KandidaterTableHeader
                            onFilterUtdanningClick={this.onFilterUtdanningClick}
                            onFilterJobberfaringClick={this.onFilterJobberfaringClick}
                            onFilterAntallArClick={this.onFilterAntallArClick}
                            from={5}
                            to={this.state.antallResultater}
                        />
                        {this.state.cver.slice(5, this.state.antallResultater).map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.arenaKandidatnr}
                            />
                        ))}
                        {this.state.cver.length > this.state.antallResultater && (
                            <div className="buttons--kandidatervisning">
                                <Column xs="6">
                                    <Knapp
                                        type="hoved"
                                        mini
                                        onClick={this.onFlereResultaterClick}
                                    >
                                        Se flere kandidater
                                    </Knapp>
                                </Column>
                                <Column xs="6">
                                    <a
                                        className="lenke lenke--lagre--sok"
                                    >
                                        Lagre søk og liste over kandidater
                                    </a>
                                </Column>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    cver: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    query: PropTypes.shape({
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string),
        stillinger: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

const mapStateToProps = (state) => ({
    cver: state.elasticSearchResultat.resultat.cver,
    totaltAntallTreff: state.elasticSearchResultat.resultat.totaltAntallTreff,
    query: state.query
});

export default connect(mapStateToProps)(KandidaterVisning);
