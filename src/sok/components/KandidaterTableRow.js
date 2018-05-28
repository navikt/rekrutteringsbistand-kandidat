import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import ShowModalResultat from './ShowModalResultat';

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
        const yrkeserfaring = cv.yrkeserfaring[cv.yrkeserfaring.length - 1] ? cv.yrkeserfaring[cv.yrkeserfaring.length - 1].styrkKodeStillingstittel : '';
        const utdanning = cv.utdanning[cv.utdanning.length - 1] ? cv.utdanning[cv.utdanning.length - 1].nusKodeGrad : '';
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
                            <button className="lenke" onClick={this.toggleModalOpen}>CV</button>
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
    // eslint-disable-next-line react/forbid-prop-types
    cv: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

export default connect(mapStateToProps)(KandidaterTableRow);
