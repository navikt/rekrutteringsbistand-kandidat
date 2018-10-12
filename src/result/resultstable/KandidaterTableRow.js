import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../PropTypes';
import './Resultstable.less';
import { CONTEXT_ROOT, USE_JANZZ } from '../../common/fasitProperties';

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

        return (
            <Row className="kandidater--row">
                {this.props.visKandidatlister &&
                    <Column xs="1" md="1">
                        <Checkbox className="text-hide" label="." checked={this.props.markert} onChange={() => { this.onCheck(cv.arenaKandidatnr); }} />
                    </Column>
                }
                <Column className="lenke--kandidatnr--wrapper" xs="3" md="3">
                    <Link
                        className="lenke--kandidatnr"
                        to={`/${CONTEXT_ROOT}/cv?kandidatNr=${kandidatnummer}`}

                        aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                    >
                        <Normaltekst className="break-word">{cv.arenaKandidatnr}</Normaltekst>
                    </Link>
                </Column>

                {USE_JANZZ ? (
                    <Column xs="4" md="4">
                        <Normaltekst className="break-word score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                    </Column>
                ) : (
                    <Column xs="4" md="4">
                        <Normaltekst className="break-word utdanning">{utdanning}</Normaltekst>
                    </Column>
                )}
                <Column xs="4" md="4">
                    <Normaltekst className="break-word yrkeserfaring">{yrkeserfaring}</Normaltekst>
                </Column>
            </Row>
        );
    }
}

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    visKandidatlister: PropTypes.bool.isRequired,
    markert: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

export default connect(mapStateToProps)(KandidaterTableRow);
