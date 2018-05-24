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
        this.setState({
            cver: nextProps.cver
        });
    }

    onFlereResultaterClick = () => {
        this.setState({
            antallResultater: this.state.antallResultater + 15
        });
    };

    onFilterUtdanningClick = () => {
        const cver = this.state.cver.slice(0, 5).sort((cv1, cv2) => {
            // TODO: Sortere på relevant utdanning, ikke bare første utdanning
            const cv1utd = cv1.utdanning[0] ? cv1.utdanning[0].nusKode : 0;
            const cv2utd = cv2.utdanning[0] ? cv2.utdanning[0].nusKode : 0;
            if (this.state.utdanningChevronNed) {
                return cv1utd > cv2utd;
            }
            return cv1utd < cv2utd;
        });
        this.setState({
            cver,
            utdanningChevronNed: !this.state.utdanningChevronNed,
            jobberfaringChevronNed: undefined,
            antallArChevronNed: undefined
        });
    };

    onFilterJobberfaringClick = () => {
        const cver = this.state.cver.slice(0, 5).sort((cv1, cv2) => {
            // TODO: Sortere på relevant yrkeserfaring, ikke bare første erfaring
            const cv1job = cv1.yrkeserfaring[0] ? cv1.yrkeserfaring[0].styrkKodeStillingstittel : '';
            const cv2job = cv2.yrkeserfaring[0] ? cv2.yrkeserfaring[0].styrkKodeStillingstittel : '';
            if (this.state.jobberfaringChevronNed) {
                return cv1job < cv2job;
            }
            return cv1job > cv2job;
        });
        this.setState({
            cver,
            utdanningChevronNed: undefined,
            jobberfaringChevronNed: !this.state.jobberfaringChevronNed,
            antallArChevronNed: undefined
        });
    };

    onFilterAntallArClick = () => {
        const cver = this.state.cver.slice(0, 5).sort((cv1, cv2) => {
            if (this.state.antallArChevronNed) {
                return cv1.totalLengdeYrkeserfaring > cv2.totalLengdeYrkeserfaring;
            }
            return cv1.totalLengdeYrkeserfaring < cv2.totalLengdeYrkeserfaring;
        });
        this.setState({
            cver,
            utdanningChevronNed: undefined,
            jobberfaringChevronNed: undefined,
            antallArChevronNed: !this.state.antallArChevronNed
        });
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
        console.log(this.state.cver);
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
                        utdanningNed={this.state.utdanningChevronNed}
                        jobberfaringNed={this.state.jobberfaringChevronNed}
                        antallArNed={this.state.antallArChevronNed}
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
                {this.props.cver.length > 5 && (
                    <div className="resultatvisning">
                        <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                        <KandidaterTableHeader />
                        {this.props.cver.slice(5, this.state.antallResultater).map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.epostadresse}
                            />
                        ))}
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
                    </div>
                )}
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    cver: PropTypes.arrayOf(PropTypes.object).isRequired,
    treff: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    cver: state.elasticSearchResultat.resultat.cver,
    treff: state.elasticSearchResultat.total
});

export default connect(mapStateToProps)(KandidaterVisning);
