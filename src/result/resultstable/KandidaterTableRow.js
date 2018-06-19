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
        const yrkeserfaring = cv.yrkeserfaring[0] ? cv.yrkeserfaring[0].styrkKodeStillingstittel : '';
        const utdanning = cv.utdanning[0] ? cv.utdanning[0].nusKodeGrad : '';
        return (
            <div>
                <div className="panel border--top--thin">
                    <Row>
                        <Column xs="2" md="2">
                            <Normaltekst>{cv.arenaKandidatnr}</Normaltekst></Column>
                        <Column xs="4" md="4">
                            <Normaltekst>{utdanning}</Normaltekst>
                        </Column>
                        <Column xs="3" md="3">
                            <Normaltekst>{yrkeserfaring}</Normaltekst>
                        </Column>
                        <Column xs="2" md="2" className="text-center">
                            <Normaltekst>{`${Math.round(cv.totalLengdeYrkeserfaring / 12)} år`}</Normaltekst>
                        </Column>
                        <Column xs="1" md="1">
                            <button
                                className="lenke"
                                onClick={this.openCvModal}
                                aria-label={`CV for ${cv.arenaKandidatnr}`}
                            >
                                CV
                            </button>
                        </Column>
                    </Row>
                </div>
            </div>
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
