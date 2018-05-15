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
                        <Column xs="2" md="2"><Normaltekst>{this.props.kandidat}</Normaltekst></Column>
                        <Column xs="4" md="4"><Normaltekst>{this.props.utdanning}</Normaltekst></Column>
                        <Column xs="3" md="3"><Normaltekst>{this.props.arbeidserfaring}</Normaltekst></Column>
                        <Column xs="2" md="2" className="text-center"><Normaltekst>{this.props.arbeidserfaringTid}</Normaltekst></Column>
                        <Column xs="1" md="1"><button className="lenke" onClick={this.toggleModalOpen}>CV</button></Column>
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
    kandidat: PropTypes.string.isRequired,
    utdanning: PropTypes.string.isRequired,
    arbeidserfaring: PropTypes.string.isRequired,
    arbeidserfaringTid: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cv: PropTypes.object.isRequired
};
