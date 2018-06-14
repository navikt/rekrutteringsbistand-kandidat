import React from 'react';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import ShowModalResultat from '../modal/ShowModalResultat';
import { cvPropTypes } from '../../PropTypes';
import './Resultstable.less';

class KandidaterTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
    }

    toggleModalOpen = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
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
                                onClick={this.toggleModalOpen}
                                aria-label={`CV for ${cv.arenaKandidatnr}`}
                            >
                                CV
                            </button>
                        </Column>
                    </Row>
                </div>
                <ShowModalResultat
                    modalIsOpen={this.state.modalIsOpen}
                    toggleModalOpen={this.toggleModalOpen}
                    cv={cv}
                />
            </div>
        );
    }
}

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

export default connect(mapStateToProps)(KandidaterTableRow);
