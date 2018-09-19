import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../PropTypes';
import './Resultstable.less';
import { FETCH_CV, OPEN_CV_MODAL } from '../../sok/cv/cvReducer';

class KandidaterTableRow extends React.Component {
    openCvModal = () => {
        this.props.openCvModal();
        this.props.hentCvForKandidat(this.props.cv.arenaKandidatnr);
    };

    render() {
        const cv = this.props.cv;
        const kandidatnummer = this.props.cv.arenaKandidatnr;
        const yrkeserfaring = cv.mestRelevanteYrkeserfaring ? cv.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        const utdanning = cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKodeGrad : '';
        const score = cv.score;
        const lengdeYrkeserfaring = Math.floor(cv.totalLengdeYrkeserfaring / 12);
        let lengdeYrkeserfaringTekst;
        if (lengdeYrkeserfaring === 0) {
            lengdeYrkeserfaringTekst = 'Under 1 år';
        } else if (lengdeYrkeserfaring > 10) {
            lengdeYrkeserfaringTekst = 'Over 10 år';
        } else {
            lengdeYrkeserfaringTekst = `${lengdeYrkeserfaring} år`;
        }

        if (this.props.visNyVisKandidatSide) {
            return (
                <Link
                    to={`/pam-kandidatsok/cv?kandidatNr=${kandidatnummer}`}
                    className="panel border--top--thin kandidater--row"
                    aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                >
                    <Row>
                        <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                            <Normaltekst className="break-word lenke lenke--kandidatnr">{cv.arenaKandidatnr}</Normaltekst>
                        </Column>
                        {this.props.janzzEnabled ? (
                            <Column className="no--padding" xs="4" md="4">
                                <i className="border--vertical" />
                                <Normaltekst className="break-word score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                            </Column>
                        ) : (
                            <Column className="no--padding" xs="4" md="4">
                                <i className="border--vertical" />
                                <Normaltekst className="break-word utdanning">{utdanning}</Normaltekst>
                            </Column>
                        )}
                        <Column className="no--padding" xs="4" md="4">
                            <i className="border--vertical" />
                            <Normaltekst className="break-word yrkeserfaring">{yrkeserfaring}</Normaltekst>
                        </Column>
                        <Column xs="2" md="2" className="text-center no--padding">
                            <i className="border--vertical" />
                            <Normaltekst className="inline lengdeYrkeserfaringTekst">{lengdeYrkeserfaringTekst}</Normaltekst>
                        </Column>
                    </Row>

                </Link>
            );
        }

        return (
            <button
                className="panel border--top--thin kandidater--row"
                onClick={this.openCvModal}
                aria-label={`Se CV for ${cv.arenaKandidatnr}`}
            >
                <Row>
                    <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                        <Normaltekst className="break-word lenke lenke--kandidatnr">{cv.arenaKandidatnr}</Normaltekst>
                    </Column>
                    {this.props.janzzEnabled ? (
                        <Column className="no--padding" xs="4" md="4">
                            <i className="border--vertical" />
                            <Normaltekst className="break-word score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                        </Column>
                    ) : (
                        <Column className="no--padding" xs="4" md="4">
                            <i className="border--vertical" />
                            <Normaltekst className="break-word utdanning">{utdanning}</Normaltekst>
                        </Column>
                    )}
                    <Column className="no--padding" xs="4" md="4">
                        <i className="border--vertical" />
                        <Normaltekst className="break-word yrkeserfaring">{yrkeserfaring}</Normaltekst>
                    </Column>
                    <Column xs="2" md="2" className="text-center no--padding">
                        <i className="border--vertical" />
                        <Normaltekst className="inline">{lengdeYrkeserfaringTekst}</Normaltekst>
                    </Column>
                </Row>
            </button>
        );
    }
}

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    openCvModal: PropTypes.func.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    janzzEnabled: PropTypes.bool.isRequired,
    visNyVisKandidatSide: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    janzzEnabled: state.search.featureToggles['janzz-enabled'],
    visNyVisKandidatSide: state.search.featureToggles['vis-ny-vis-kandidat-side']
});

const mapDispatchToProps = (dispatch) => ({
    openCvModal: () => dispatch({ type: OPEN_CV_MODAL }),
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
