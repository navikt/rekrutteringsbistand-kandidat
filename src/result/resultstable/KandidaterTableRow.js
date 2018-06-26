import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { cvPropTypes } from '../../PropTypes';
import './Resultstable.less';
import { FETCH_CV, OPEN_CV_MODAL } from '../../sok/cv/cvReducer';

class KandidaterTableRow extends React.Component {
    openCvModal = () => {
        this.props.openCvModal();
        this.props.hentCvForKandidat(this.props.cv.arenaKandidatnr);
    };

    render() {
        const cv = this.props.cv;
        const yrkeserfaring = cv.mestRelevanteYrkeserfaring ? cv.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        const utdanning = cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKodeGrad : '';
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
            <button
                className="panel border--top--thin kandidater--row"
                onClick={this.openCvModal}
                aria-label={`Se CV for ${cv.arenaKandidatnr}`}
            >
                <Row>
                    <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                        <Normaltekst className="break-word lenke lenke--kandidatnr">{cv.arenaKandidatnr}</Normaltekst>
                    </Column>
                    <Column className="no--padding" xs="4" md="4">
                        <i className="border--vertical" />
                        <Normaltekst className="break-word utdanning">{utdanning}</Normaltekst>
                    </Column>
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
    hentCvForKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    openCvModal: () => dispatch({ type: OPEN_CV_MODAL }),
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
