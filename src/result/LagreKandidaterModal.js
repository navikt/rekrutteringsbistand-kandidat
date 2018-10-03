import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { HENT_KANDIDATLISTER } from '../kandidatlister/kandidatlisteReducer';


const markerKandidater = (kandidatlister) => (
    kandidatlister ? kandidatlister.map((k) => ({ ...k, markert: false })) : undefined
);

class LagreKandidaterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlister: markerKandidater(props.kandidatlister)
        };
    }
    componentDidMount() {
        this.props.hentKandidatlister();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kandidatlister !== this.props.kandidatlister) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidatlister: markerKandidater(this.props.kandidatlister)
            });
        }
    }


    onKandidatlisteCheck = (kandidatlisteId) => {
        this.setState({
            kandidatlister: this.state.kandidatlister.map((liste) => {
                if (liste.kandidatlisteId === kandidatlisteId) {
                    return { ...liste, markert: !liste.markert };
                }
                return liste;
            })
        });
    };

    lagreKandidaterILister = () => {
        this.props.onLagre(this.state.kandidatlister
            .filter((liste) => (liste.markert))
            .map((liste) => (liste.kandidatlisteId)));
    };

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
                            { this.state.kandidatlister && this.state.kandidatlister.map((liste) =>
                                (<Checkbox
                                    checked={liste.markert}
                                    onChange={() => { this.onKandidatlisteCheck(liste.kandidatlisteId); }}
                                    label={liste.tittel}
                                    key={liste.kandidatlisteId}
                                />)) }

                            <Knapp
                                type="hoved"
                                onClick={this.lagreKandidaterILister}
                            >
                                    test
                            </Knapp>

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
    onLagre: PropTypes.func.isRequired,
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
