import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { HENT_KANDIDATLISTER } from '../kandidatlister/kandidatlisteReducer';

class LagreKandidaterModal extends React.Component {
    componentDidMount() {
        this.props.hentKandidatlister();
    }

    render() {
        return (

            <Modal
                isOpen
                onRequestClose={this.props.onRequestClose}
                closeButton
                contentLabel="LagreKandidaterModal."
            >
                <div className="LagreKandidaterModal">
                    {this.props.fetchingKandidatlister
                        ? <div className="text-center">
                            <NavFrontendSpinner type="L" />
                        </div>
                        : <div>
                            <Innholdstittel>
                                Lagre kandidater
                            </Innholdstittel>
                            <Undertittel>
                                Velg en eller flere kandidater
                            </Undertittel>
                            { this.props.kandidatlister && this.props.kandidatlister.map((liste) => <Checkbox label={liste.tittel} key={liste.kandidatlisteId} />) }
                        </div>
                    }

                </div>
            </Modal>
        );
    }
}

const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    oppdragsgiver: PropTypes.string
});

LagreKandidaterModal.defaultProps = {
    kandidatlister: undefined
};

LagreKandidaterModal.propTypes = {
    hentKandidatlister: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.bool.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse)
};

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => { dispatch({ type: HENT_KANDIDATLISTER }); }
});

const mapStateToProps = (state) => ({
    kandidatlister: state.kandidatlister.kandidatlister,
    fetchingKandidatlister: state.kandidatlister.fetchingKandidatlister
});


export default connect(mapStateToProps, mapDispatchToProps)(LagreKandidaterModal);
