/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
    DELE_STATUS,
    ENDRE_STATUS_KANDIDAT,
    HENT_KANDIDATLISTE,
    PRESENTER_KANDIDATER,
    RESET_DELE_STATUS
} from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import PresenterKandidaterModal from './PresenterKandidaterModal';
import LeggTilKandidatModal from './LeggTilKandidatModal';
import ListedetaljerView from './ListedetaljerView';
import { Kandidatliste } from './PropTypes';
import './Listedetaljer.less';

class Listedetaljer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleMarkert: false,
            kandidater: props.kandidatliste === undefined ? undefined :
                props.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false
                })),
            deleModalOpen: false,
            leggTilModalOpen: false,
            suksessMelding: {
                vis: false,
                tekst: ''
            }
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.hentKandidatliste(id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.deleStatus !== prevProps.deleStatus && this.props.deleStatus === DELE_STATUS.SUCCESS) {
            this.props.resetDeleStatus();
            this.visSuccessMelding('Kandidatene er delt med arbeidsgiver');
        }
        if (this.props.leggTilStatus !== prevProps.leggTilStatus && this.props.leggTilStatus === LAGRE_STATUS.SUCCESS) {
            this.visSuccessMelding(`Kandidat ${this.props.kandidat.fornavn} ${this.props.kandidat.etternavn} (${this.props.fodselsnummer}) er lagt til`);
        }
        if (!this.props.kandidatliste) {
            return;
        }
        if ((!prevProps.kandidatliste && this.props.kandidatliste.kandidater)
            || prevProps.kandidatliste.kandidater !== this.props.kandidatliste.kandidater) {
            this.setState({
                kandidater: this.props.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false
                }))
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.deleSuksessMeldingCallbackId);
    }

    onCheckAlleKandidater = (markert) => {
        this.setState({
            alleMarkert: markert,
            kandidater: this.state.kandidater.map((kandidat) => ({
                ...kandidat,
                markert
            }))
        });
    };

    onToggleKandidat = (kandidatnr) => {
        this.setState({
            alleMarkert: false,
            kandidater: this.state.kandidater.map((kandidat) => {
                if (kandidat.kandidatnr === kandidatnr) {
                    return {
                        ...kandidat,
                        markert: !kandidat.markert
                    };
                }
                return kandidat;
            })
        });
    };

    onToggleDeleModal = () => {
        this.setState({
            deleModalOpen: !this.state.deleModalOpen
        });
    };

    onToggleLeggTilKandidatModal = () => {
        this.setState({
            leggTilModalOpen: !this.state.leggTilModalOpen
        });
    };

    onDelMedArbeidsgiver = (beskjed, mailadresser) => {
        this.props.presenterKandidater(
            beskjed,
            mailadresser,
            this.props.kandidatliste.kandidatlisteId,
            this.state.kandidater
                .filter((kandidat) => kandidat.markert)
                .map((kandidat) => kandidat.kandidatnr)
        );
        this.setState({
            deleModalOpen: false
        });
    };

    visSuccessMelding = (tekst) => {
        clearTimeout(this.deleSuksessMeldingCallbackId);
        this.setState({
            suksessMelding: {
                vis: true,
                tekst
            }
        });
        this.deleSuksessMeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessMelding: {
                    vis: false,
                    tekst: ''
                }
            });
        }, 5000);
    };


    render() {
        if (this.props.fetching || !this.props.kandidatliste || !this.state.kandidater) {
            return (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }

        const { tittel, organisasjonNavn, opprettetAv, kandidatlisteId, stillingId, kanEditere } = this.props.kandidatliste;
        const { kandidater, alleMarkert, deleModalOpen, suksessMelding, leggTilModalOpen } = this.state;
        return (
            <div>
                {deleModalOpen &&
                    <PresenterKandidaterModal
                        vis={this.state.deleModalOpen}
                        onClose={this.onToggleDeleModal}
                        onSubmit={this.onDelMedArbeidsgiver}
                        antallKandidater={kandidater.filter((kandidat) => (kandidat.markert)).length}
                    />
                }
                {leggTilModalOpen &&
                    <LeggTilKandidatModal
                        vis={this.state.leggTilModalOpen}
                        onClose={this.onToggleLeggTilKandidatModal}
                        stillingsId={stillingId}
                    />
                }
                <HjelpetekstFading synlig={suksessMelding.vis} type="suksess" tekst={suksessMelding.tekst} />
                <ListedetaljerView
                    tittel={tittel}
                    arbeidsgiver={organisasjonNavn}
                    opprettetAv={opprettetAv}
                    kandidatlisteId={kandidatlisteId}
                    stillingsId={stillingId}
                    kanEditere={kanEditere}
                    kandidater={kandidater}
                    alleMarkert={alleMarkert}
                    onToggleKandidat={this.onToggleKandidat}
                    onCheckAlleKandidater={() => {
                        this.onCheckAlleKandidater(!alleMarkert);
                    }}
                    onKandidatStatusChange={this.props.endreStatusKandidat}
                    onKandidatShare={this.onToggleDeleModal}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                />
            </div>
        );
    }
}

Listedetaljer.defaultProps = {
    kandidatliste: undefined,
    fodselsnummer: undefined,
    kandidat: {
        fornavn: '',
        etternavn: ''
    }
};

Listedetaljer.propTypes = {
    fetching: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape(Kandidatliste),
    hentKandidatliste: PropTypes.func.isRequired,
    endreStatusKandidat: PropTypes.func.isRequired,
    presenterKandidater: PropTypes.func.isRequired,
    resetDeleStatus: PropTypes.func.isRequired,
    deleStatus: PropTypes.string.isRequired,
    leggTilStatus: PropTypes.string.isRequired,
    fodselsnummer: PropTypes.string,
    kandidat: PropTypes.shape({
        fornavn: PropTypes.string,
        etternavn: PropTypes.string
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    }).isRequired
};

const mapStateToProps = (state) => ({
    fetching: state.kandidatlister.detaljer.fetching,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (stillingsnummer) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer }); },
    endreStatusKandidat: (status, kandidatlisteId, kandidatnr) => { dispatch({ type: ENDRE_STATUS_KANDIDAT, status, kandidatlisteId, kandidatnr }); },
    presenterKandidater: (beskjed, mailadresser, kandidatlisteId, kandidatnummerListe) => { dispatch({ type: PRESENTER_KANDIDATER, beskjed, mailadresser, kandidatlisteId, kandidatnummerListe }); },
    resetDeleStatus: () => { dispatch({ type: RESET_DELE_STATUS }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Listedetaljer);

