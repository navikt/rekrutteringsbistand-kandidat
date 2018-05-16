import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import ShowModalResultat from './ShowModalResultat';

export default class KandidaterTableRow extends React.Component {
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
        return (
            <div>
                <div className="panel border--top--thin">
                    <Row>
                        <Column xs="2" md="2">
                            <Normaltekst>{this.props.cv.arenaKandidatnr}</Normaltekst></Column>
                        <Column xs="4" md="4">
                            <Normaltekst>{this.props.cv.utdanning.length > 0 ? this.props.cv.utdanning[0].nusKodeGrad : ''}</Normaltekst>
                        </Column>
                        <Column xs="3" md="3">
                            <Normaltekst>{this.props.cv.yrkeserfaring.length > 0 ? this.props.cv.yrkeserfaring[0].styrkKodeStillingstittel : ''}</Normaltekst>
                        </Column>
                        <Column xs="2" md="2" className="text-center">
                            <Normaltekst>{`${Math.round(this.props.cv.totalLengdeYrkeserfaring / 12)} år`}</Normaltekst>
                        </Column>
                        <Column xs="1" md="1">
                            <button className="lenke" onClick={this.toggleModalOpen}>CV</button>
                        </Column>
                    </Row>
                </div>
                <ShowModalResultat
                    modalIsOpen={this.state.modalIsOpen}
                    toggleModalOpen={this.toggleModalOpen}
                    cv={this.props.cv}
                />
            </div>
        );
    }
}

KandidaterTableRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    cv: PropTypes.object.isRequired
};
