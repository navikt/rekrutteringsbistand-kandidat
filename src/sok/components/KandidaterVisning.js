import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import KandidaterTableHeader from './KandidaterTableHeader';
import KandidaterTableRow from './KandidaterTableRow';

class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallResultater: 20,
            cver: this.props.cver
        };
    }

    componentWillReceiveProps(nextProps) {
        // Sortere utdanning slik at høyest oppnådd utdanning vises i resultat-listen,
        // og at det er denne det filtreres på.
        nextProps.cver.map((cv) => cv.utdanning.sort((cv1, cv2) => cv1.nusKode > cv2.nusKode));

        nextProps.cver.forEach((cv) => {
            const erfaringer = cv.yrkeserfaring.map((y) =>
                nextProps.query.arbeidserfaringer.find((a) => y.styrkKodeStillingstittel === a));
            const erfaring = erfaringer.reverse().find((e) => e !== undefined);
            if (erfaring) {
                const index = erfaringer.reverse().indexOf(erfaring);
                this.swapJobberfaringer(cv.yrkeserfaring, cv.yrkeserfaring.length - 1, index);
            }
        });

        this.setState({
            cver: nextProps.cver
        });
    }

    onFlereResultaterClick = () => {
        this.setState({
            antallResultater: this.state.antallResultater + 15
        });
    };

    onFilterUtdanningClick = (utdanningChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
            const cv1utd = cv1.utdanning[cv1.utdanning.length - 1] ? cv1.utdanning[cv1.utdanning.length - 1].nusKode : 0;
            const cv2utd = cv2.utdanning[cv2.utdanning.length - 1] ? cv2.utdanning[cv2.utdanning.length - 1].nusKode : 0;
            if (utdanningChevronNed) {
                return cv1utd > cv2utd;
            }
            return cv1utd < cv2utd;
        });
        this.setState({
            cver
        });
    };

    onFilterJobberfaringClick = (jobberfaringChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
            const cv1job = cv1.yrkeserfaring[cv1.yrkeserfaring.length - 1] ? cv1.yrkeserfaring[cv1.yrkeserfaring.length - 1].styrkKodeStillingstittel : '';
            const cv2job = cv2.yrkeserfaring[cv2.yrkeserfaring.length - 1] ? cv2.yrkeserfaring[cv2.yrkeserfaring.length - 1].styrkKodeStillingstittel : '';
            if (jobberfaringChevronNed) {
                return cv1job < cv2job;
            }
            return cv1job > cv2job;
        });
        this.setState({
            cver
        });
    };

    onFilterAntallArClick = (antallArChevronNed, from, to) => {
        const cver = this.state.cver.slice(from, to).sort((cv1, cv2) => {
            if (antallArChevronNed) {
                return cv1.totalLengdeYrkeserfaring > cv2.totalLengdeYrkeserfaring;
            }
            return cv1.totalLengdeYrkeserfaring < cv2.totalLengdeYrkeserfaring;
        });
        this.setState({
            cver
        });
    };

    swapJobberfaringer = (jobberfaring, int1, int2) => {
        let i = int2;
        while (i < int1) {
            jobberfaring.splice(i + 1, 0, jobberfaring.splice(i, 1).pop());
            i += 1;
        }
    };

    render() {
        let tittel = '';
        if (this.props.treff > 5) {
            tittel = 'Topp 5 kandidater';
        } else if (this.props.treff === 0) {
            tittel = 'Ingen direkte treff';
        } else if (this.props.treff === 1) {
            tittel = 'Beste kandidat';
        } else {
            tittel = `Topp ${this.props.treff} kandidater`;
        }
        return (
            <div>
                <Row className="panel resultatvisning">
                    <Column xs="6" md="6">
                        <Ingress className="text--left"><strong>{this.props.treff}</strong> treff på aktuelle kandidater</Ingress>
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
                    {this.state.cver.slice(0, 5).map((cv, i) => (
                        <KandidaterTableRow
                            // TODO: Rewrite the next line after user-test
                            cv={i === 1 ? { ...cv, samtykkeStatus: 'N' } : cv}
                            // cv={cv}
                            key={cv.epostadresse}
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
                                key={cv.epostadresse}
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
    cver: PropTypes.arrayOf(PropTypes.object).isRequired,
    treff: PropTypes.number.isRequired,
    query: PropTypes.shape({
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

const mapStateToProps = (state) => ({
    cver: state.elasticSearchResultat.resultat.cver,
    treff: state.elasticSearchResultat.total,
    query: state.query
});

export default connect(mapStateToProps)(KandidaterVisning);
