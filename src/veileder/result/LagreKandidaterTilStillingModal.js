import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';

class LagreKandidaterTilStillingModal extends React.Component {
    lagreKandidater = () => {
        this.props.onLagre([this.props.kandidatlisteId]);
    };

    render() {
        const { onRequestClose, annonseoverskrift, antallMarkerteKandidater } = this.props;
        return (
            <Modal
                isOpen
                onRequestClose={onRequestClose}
                closeButton
                contentLabel="LagreKandidaterModal."
                className="LagreKandidaterTilStillingModal"
                appElement={document.getElementById('app')}
            >
                <div className="LagreKandidaterTilStillingModal--wrapper">
                    <Systemtittel className="tittel">{
                        antallMarkerteKandidater > 1
                            ? 'Lagre kandidater'
                            : 'Lagre kandidat'
                    }
                    </Systemtittel>
                    <Normaltekst>{
                        antallMarkerteKandidater > 1
                            ? `Ønsker du å lagre kandidatene i kandidatlisten til stillingen «${annonseoverskrift}»?`
                            : `Ønsker du å lagre kandidaten i kandidatlisten til stillingen «${annonseoverskrift}»?`
                    }
                    </Normaltekst>
                    <div>
                        <Hovedknapp className="lagre--knapp" onClick={this.lagreKandidater}>Lagre</Hovedknapp>
                        <Flatknapp className="avbryt--knapp" onClick={onRequestClose}>Avbryt</Flatknapp>
                    </div>
                </div>
            </Modal>
        );
    }
}

LagreKandidaterTilStillingModal.defaultProps = {
    annonseoverskrift: undefined
};

LagreKandidaterTilStillingModal.propTypes = {
    onLagre: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    annonseoverskrift: PropTypes.string,
    antallMarkerteKandidater: PropTypes.number.isRequired,
    kandidatlisteId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    annonseoverskrift: state.search.annonseoverskrift
});

export default connect(mapStateToProps)(LagreKandidaterTilStillingModal);
