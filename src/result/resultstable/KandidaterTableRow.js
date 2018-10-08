import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../PropTypes';
import './Resultstable.less';
import { CONTEXT_ROOT } from '../../common/fasitProperties';

class KandidaterTableRow extends React.Component {
    onCheck = (kandidatnr) => {
        this.props.onKandidatValgt(!this.props.markert, kandidatnr);
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

        return (

            <Row className="kandidater--row">

                {this.props.visKandidatlister &&
                    <Column xs="1" md="1">
                        <Checkbox className="text-hide" label="" checked={this.props.markert} onChange={() => { this.onCheck(cv.arenaKandidatnr); }} />
                    </Column>
                }

                <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                    <Link
                        className="lenke--kandidatnr"
                        to={`/${CONTEXT_ROOT}/cv?kandidatNr=${kandidatnummer}`}

                        aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                    >

                        <Normaltekst className="break-word">{cv.arenaKandidatnr}</Normaltekst>

                    </Link>
                </Column>

                {this.props.janzzEnabled ? (
                    <Column className="no-padding" xs="3" md="3">
                        <Normaltekst className="break-word score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                    </Column>
                ) : (
                    <Column className="no-padding" xs="3" md="3">
                        <Normaltekst className="break-word utdanning">{utdanning}</Normaltekst>
                    </Column>
                )}
                <Column className="no-padding" xs="4" md="4">
                    <Normaltekst className="break-word yrkeserfaring">{yrkeserfaring}</Normaltekst>
                </Column>
                <Column xs="2" md="2" className="text-center no-padding">
                    <Normaltekst className="inline lengdeYrkeserfaringTekst">{lengdeYrkeserfaringTekst}</Normaltekst>
                </Column>


            </Row>


        );
    }
}

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    janzzEnabled: PropTypes.bool.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    visKandidatlister: PropTypes.bool.isRequired,
    markert: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    janzzEnabled: state.search.featureToggles['janzz-enabled'],
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

export default connect(mapStateToProps)(KandidaterTableRow);
