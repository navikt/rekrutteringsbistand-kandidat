import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import ShowCv from './ShowCv';
import AnonymCvTekst from './AnonymCvTekst';
import SendBeskjedKandidat from './SendBeskjedKandidat';
import BeskjedSendt from './BeskjedSendt';
import { cvPropTypes } from '../../PropTypes';

export default class ShowModalResultat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steg: 0
        };
    }

    componentWillMount() {
        // The modal gives an error if the Modal is trying to set the app element to document.body
        // before it exists. Have to add this to set the document.body element.
        NavFrontendModal.setAppElement('body');
    }

    onTaKontaktClick = () => {
        this.setState({
            steg: 1
        });
    };

    onCloseModalClick = () => {
        this.props.toggleModalOpen();
        this.setState({
            steg: 0
        });
    };

    onSendClick = () => {
        this.setState({
            steg: 2
        });
    };


    render() {
        return (
            <NavFrontendModal
                isOpen={this.props.modalIsOpen}
                contentLabel="modal resultat"
                onRequestClose={this.onCloseModalClick}
                className="modal--resultat"
                closeButton
            >
                {this.state.steg === 0 && (this.props.cv.samtykkeStatus === 'J'
                    || this.props.cv.samtykkeStatus === 'G' || this.props.cv.samtykkeStatus === 'B') && (
                    <ShowCv
                        cv={this.props.cv}
                        onTaKontaktClick={this.onTaKontaktClick}
                    />
                )}
                {this.state.steg === 0 && this.props.cv.samtykkeStatus === 'N' && (
                    <AnonymCvTekst
                        onTaKontaktClick={this.onTaKontaktClick}
                        toggleModalOpen={this.onCloseModalClick}
                    />
                )}
                {this.state.steg === 1 && (
                    <SendBeskjedKandidat
                        toggleModalOpen={this.onCloseModalClick}
                        onSendClick={this.onSendClick}
                    />
                )}
                {this.state.steg === 2 && (
                    <BeskjedSendt
                        toggleModalOpen={this.onCloseModalClick}
                    />
                )}
            </NavFrontendModal>
        );
    }
}

ShowModalResultat.propTypes = {
    toggleModalOpen: PropTypes.func.isRequired,
    modalIsOpen: PropTypes.bool.isRequired,
    cv: cvPropTypes.isRequired
};

