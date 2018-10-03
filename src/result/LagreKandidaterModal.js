import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import KnappBase from 'nav-frontend-knapper';
import { HENT_KANDIDATLISTER, OPPRETT_KANDIDATLISTE } from '../kandidatlister/kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';
import OpprettKandidatlisteForm from '../kandidatlister/OpprettKandidatlisteForm';
import { tomKandidatlisteInfo } from '../kandidatlister/OpprettKandidatliste';

const markerKandidatlister = (kandidatlister, markerteIder = []) => (
    kandidatlister ? kandidatlister.map((k) => ({ ...k, markert: markerteIder.includes(k.kandidatlisteId) })) : undefined
);

class LagreKandidaterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlister: markerKandidatlister(props.kandidatlister),
            alleKandidatlisterVises: false,
            opprettKandidatlisteVises: false
        };
    }

    componentDidMount() {
        this.props.hentKandidatlister();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kandidatlister !== this.props.kandidatlister) {
            const markerteIder = this.state.kandidatlister
                ? this.state.kandidatlister
                    .filter((liste) => (liste.markert))
                    .map((liste) => (liste.kandidatlisteId))
                : [];

            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                kandidatlister: markerKandidatlister(this.props.kandidatlister, markerteIder)
            });
        }
        if (prevProps.opprettKandidatlisteStatus !== this.props.opprettKandidatlisteStatus && this.props.opprettKandidatlisteStatus === LAGRE_STATUS.SUCCESS) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                opprettKandidatlisteVises: false
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

    visAlleKandidatlister = () => {
        this.setState({
            alleKandidatlisterVises: true
        });
    };
    toggleOpprettNyKandidatlisteVises = () => {
        this.setState({
            opprettKandidatlisteVises: !this.state.opprettKandidatlisteVises
        });
    };
    render() {
        let kandidatlister;

        if (this.state.kandidatlister) {
            kandidatlister = this.state.alleKandidatlisterVises ? this.state.kandidatlister : this.state.kandidatlister.slice(0, 5);
        }
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
                                Velg en eller flere kandidatlister
                            </Undertittel>
                            { kandidatlister && kandidatlister.map((liste) =>
                                (<Checkbox
                                    checked={liste.markert}
                                    onChange={() => { this.onKandidatlisteCheck(liste.kandidatlisteId); }}
                                    label={liste.tittel}
                                    key={liste.kandidatlisteId}
                                />)) }

                            {!this.state.alleKandidatlisterVises && <KnappBase
                                type="flat"
                                onClick={this.visAlleKandidatlister}
                            >
                                    Vis alle Listene
                            </KnappBase>}

                            {this.state.opprettKandidatlisteVises ?
                                (
                                    <OpprettKandidatlisteForm
                                        onSave={this.props.opprettKandidatliste}
                                        onChange={() => {}}
                                        onDisabledClick={() => {}}
                                        kandidatlisteInfo={tomKandidatlisteInfo()}
                                        saving={this.props.opprettKandidatliste === LAGRE_STATUS.LOADING}
                                        onAvbrytClick={this.toggleOpprettNyKandidatlisteVises}
                                    />

                                ) : (
                                    <div>
                                        <KnappBase
                                            type="flat"
                                            onClick={this.toggleOpprettNyKandidatlisteVises}
                                        >
                                            + Opprett ny liste
                                        </KnappBase>

                                        <KnappBase
                                            type="hoved"
                                            onClick={this.lagreKandidaterILister}
                                        >
                                    Lagre
                                        </KnappBase>

                                        <KnappBase
                                            type="flat"
                                            onClick={this.props.onRequestClose}
                                        >
                                    Avbryt
                                        </KnappBase>
                                    </div>
                                )}

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
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    opprettKandidatliste: PropTypes.func.isRequired,
    opprettKandidatlisteStatus: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlister: () => { dispatch({ type: HENT_KANDIDATLISTER }); },
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); }
});

const mapStateToProps = (state) => ({
    kandidatlister: state.kandidatlister.kandidatlister,
    fetchingKandidatlister: state.kandidatlister.fetchingKandidatlister,
    opprettKandidatlisteStatus: state.kandidatlister.opprett.lagreStatus
});


export default connect(mapStateToProps, mapDispatchToProps)(LagreKandidaterModal);
