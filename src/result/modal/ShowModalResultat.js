import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import ShowCv from './ShowCv';
import AnonymCvTekst from './AnonymCvTekst';
import SendBeskjedKandidat from './SendBeskjedKandidat';
import BeskjedSendt from './BeskjedSendt';
import { cvPropTypes } from '../../PropTypes';
import './Modal.less';

class ShowModalResultat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steg: 0
        };
    }

    componentWillMount() {
        // The modal gives an error if the Modal is trying to set the app element to document.body
        // before it exists. Have to add this to set the document.body element.
        NavFrontendModal.setAppElement('main');
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
                {this.state.steg === 0 && this.props.cv.samtykkeStatus !== 'N' && (
                    <ShowCv
                        arenaKandidatnr={this.props.cv.arenaKandidatnr}
                        onTaKontaktClick={this.onTaKontaktClick}
                    />
                )}
                {this.state.steg === 0 && this.props.cv.samtykkeStatus === 'N' && (
                    <AnonymCvTekst
                        onTaKontaktClick={this.onTaKontaktClick}
                        toggleModalOpen={this.onCloseModalClick}
                    />
                )}
                {/* Feature toggle for å skjule koden for å sende beskjed til kandidat */}
                {this.props.visTaKontaktKandidat && this.state.steg === 1 && (
                    <SendBeskjedKandidat
                        toggleModalOpen={this.onCloseModalClick}
                        onSendClick={this.onSendClick}
                    />
                )}
                {/* Feature toggle for å skjule koden for å vise at beskjed er sendt */}
                {this.props.visTaKontaktKandidat && this.state.steg === 2 && (
                    <BeskjedSendt
                        toggleModalOpen={this.onCloseModalClick}
                    />
                )}
            </NavFrontendModal>
        );
    }
}

ShowModalResultat.defaultProps = {
    visTaKontaktKandidat: false
};

ShowModalResultat.propTypes = {
    toggleModalOpen: PropTypes.func.isRequired,
    modalIsOpen: PropTypes.bool.isRequired,
    cv: cvPropTypes.isRequired,
    visTaKontaktKandidat: PropTypes.bool
};

const mapStateToProps = (state) => ({
    visTaKontaktKandidat: state.search.featureToggles['vis-ta-kontakt-kandidat']
});

export default connect(mapStateToProps)(ShowModalResultat);
