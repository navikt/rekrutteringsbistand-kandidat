import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import ShowCv from './ShowCv';
import cvPropTypes from '../../../felles/PropTypes';
import './Modal.less';
import { CLOSE_CV_MODAL } from '../../sok/cv/cvReducer';

class ShowModalResultat extends React.Component {
    componentWillMount() {
        // The modal gives an error if the Modal is trying to set the app element to document.body
        // before it exists. Have to add this to set the document.body element.
        NavFrontendModal.setAppElement('main');
    }
    onCloseModalClick = () => {
        this.props.closeCvModal();
    };

    render() {
        return (
            <NavFrontendModal
                isOpen={this.props.isCvModalOpen}
                contentLabel="modal resultat"
                onRequestClose={this.onCloseModalClick}
                className="modal--resultat"
                closeButton
            >
                <ShowCv
                    cv={this.props.cv}
                />
            </NavFrontendModal>
        );
    }
}

ShowModalResultat.defaultProps = {
    visTaKontaktKandidat: false
};

ShowModalResultat.propTypes = {
    cv: cvPropTypes.isRequired,
    isCvModalOpen: PropTypes.bool.isRequired,
    closeCvModal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    cv: state.cvReducer.cv,
    isCvModalOpen: state.cvReducer.isCvModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    closeCvModal: () => dispatch({ type: CLOSE_CV_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowModalResultat);
