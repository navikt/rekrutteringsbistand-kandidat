/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import { KandidatlisteTypes, DELE_STATUS } from './kandidatlisteReducer.ts';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import PresenterKandidaterModal from './PresenterKandidaterModal';
import LeggTilKandidatModal from './LeggTilKandidatModal';
import ListedetaljerView, { VISNINGSSTATUS } from './ListedetaljerView';
import KopierEpostModal from './KopierEpostModal.tsx';
import { Kandidatliste } from './PropTypes';
import './Listedetaljer.less';

const initialKandidatTilstand = () => ({
    markert: false,
    visningsstatus: VISNINGSSTATUS.SKJUL_PANEL,
});

const trekkUtKandidatTilstander = (kandidater = []) =>
    kandidater.reduce(
        (tilstand, kandidat) => ({
            ...tilstand,
            [kandidat.kandidatnr]: {
                markert: kandidat.markert,
                visningsstatus: kandidat.visningsstatus,
            },
        }),
        {}
    );

class Listedetaljer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleMarkert: false,
            kandidater:
                props.kandidatliste.kind !== RemoteDataTypes.SUCCESS
                    ? undefined
                    : props.kandidatliste.data.kandidater.map(kandidat => ({
                          ...kandidat,
                          ...initialKandidatTilstand(),
                      })),
            deleModalOpen: false,
            leggTilModalOpen: false,
            kopierEpostModalOpen: false,
            suksessMelding: {
                vis: false,
                tekst: '',
            },
        };
    }

    componentDidUpdate(prevProps) {
        const kandidaterHarNettoppBlittPresentert =
            this.props.deleStatus !== prevProps.deleStatus &&
            this.props.deleStatus === DELE_STATUS.SUCCESS;
        if (kandidaterHarNettoppBlittPresentert) {
            this.props.resetDeleStatus();
            const antallMarkerteKandidater = this.state.kandidater.filter(
                kandidat => kandidat.markert
            ).length;
            this.visSuccessMelding(
                `${
                    antallMarkerteKandidater > 1 ? 'Kandidatene' : 'Kandidaten'
                } er delt med arbeidsgiver`
            );
        }
        if (
            this.props.leggTilStatus !== prevProps.leggTilStatus &&
            this.props.leggTilStatus === LAGRE_STATUS.SUCCESS
        ) {
            this.visSuccessMelding(
                `Kandidat ${this.props.kandidat.fornavn} ${this.props.kandidat.etternavn} (${this.props.fodselsnummer}) er lagt til`
            );
        }
        if (this.props.kandidatliste.kind !== RemoteDataTypes.SUCCESS) {
            return;
        }
        if (
            (prevProps.kandidatliste.kind !== RemoteDataTypes.SUCCESS &&
                this.props.kandidatliste.kind === RemoteDataTypes.SUCCESS) ||
            prevProps.kandidatliste.data.kandidater !== this.props.kandidatliste.data.kandidater
        ) {
            const kandidatTilstander = trekkUtKandidatTilstander(this.state.kandidater);
            const kandidater = this.props.kandidatliste.data.kandidater.map(kandidat => {
                const kandidatTilstand =
                    (!kandidaterHarNettoppBlittPresentert &&
                        kandidatTilstander[kandidat.kandidatnr]) ||
                    initialKandidatTilstand();
                return {
                    ...kandidat,
                    ...kandidatTilstand,
                };
            });
            this.setState({
                kandidater,
                alleMarkert:
                    !kandidaterHarNettoppBlittPresentert &&
                    kandidater.filter(k => !k.markert).length === 0,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.deleSuksessMeldingCallbackId);
    }

    onCheckAlleKandidater = markert => {
        this.setState({
            alleMarkert: markert,
            kandidater: this.state.kandidater.map(kandidat => ({
                ...kandidat,
                markert,
            })),
        });
    };

    onToggleKandidat = kandidatnr => {
        const kandidater = this.state.kandidater.map(kandidat => {
            if (kandidat.kandidatnr === kandidatnr) {
                return {
                    ...kandidat,
                    markert: !kandidat.markert,
                };
            }
            return kandidat;
        });
        this.setState({
            kandidater,
            alleMarkert: kandidater.filter(k => !k.markert).length === 0,
        });
    };

    onToggleDeleModal = () => {
        this.setState({
            deleModalOpen: !this.state.deleModalOpen,
        });
    };

    onToggleLeggTilKandidatModal = () => {
        this.setState({
            leggTilModalOpen: !this.state.leggTilModalOpen,
        });
    };

    onToggleKopierEpostModal = () => {
        this.setState({
            kopierEpostModalOpen: !this.state.kopierEpostModalOpen,
        });
    };

    onDelMedArbeidsgiver = (beskjed, mailadresser) => {
        this.props.presenterKandidater(
            beskjed,
            mailadresser,
            this.props.kandidatliste.data.kandidatlisteId,
            this.state.kandidater
                .filter(kandidat => kandidat.markert)
                .map(kandidat => kandidat.kandidatnr)
        );
        this.setState({
            deleModalOpen: false,
        });
    };

    onVisningChange = (visningsstatus, kandidatlisteId, kandidatnr) => {
        if (visningsstatus === VISNINGSSTATUS.VIS_NOTATER) {
            this.props.hentNotater(kandidatlisteId, kandidatnr);
        }
        this.setState({
            kandidater: this.state.kandidater.map(kandidat => {
                if (kandidat.kandidatnr === kandidatnr) {
                    return {
                        ...kandidat,
                        visningsstatus,
                    };
                }
                return {
                    ...kandidat,
                    visningsstatus: VISNINGSSTATUS.SKJUL_PANEL,
                };
            }),
        });
    };

    onEmailKandidater = () => {
        this.setState({
            kopierEpostModalOpen: true,
        });
    };

    copyToClipboard = text => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    visSuccessMelding = tekst => {
        clearTimeout(this.deleSuksessMeldingCallbackId);
        this.setState({
            suksessMelding: {
                vis: true,
                tekst,
            },
        });
        this.deleSuksessMeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessMelding: {
                    vis: false,
                    tekst: '',
                },
            });
        }, 5000);
    };

    render() {
        if (this.props.kandidatliste.kind === RemoteDataTypes.LOADING || !this.state.kandidater) {
            return (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        } else if (this.props.kandidatliste.kind !== RemoteDataTypes.SUCCESS) {
            return null;
        }

        const {
            tittel,
            organisasjonNavn,
            opprettetAv,
            kandidatlisteId,
            stillingId,
            kanEditere,
            beskrivelse,
        } = this.props.kandidatliste.data;
        const {
            kandidater,
            alleMarkert,
            deleModalOpen,
            suksessMelding,
            leggTilModalOpen,
            kopierEpostModalOpen,
        } = this.state;
        return (
            <div>
                {deleModalOpen && (
                    <PresenterKandidaterModal
                        vis={this.state.deleModalOpen}
                        onClose={this.onToggleDeleModal}
                        onSubmit={this.onDelMedArbeidsgiver}
                        antallKandidater={kandidater.filter(kandidat => kandidat.markert).length}
                    />
                )}
                {leggTilModalOpen && (
                    <LeggTilKandidatModal
                        vis={this.state.leggTilModalOpen}
                        onClose={this.onToggleLeggTilKandidatModal}
                        stillingsId={stillingId}
                        kandidatliste={this.props.kandidatliste.data}
                    />
                )}
                <KopierEpostModal
                    vis={kopierEpostModalOpen}
                    onClose={this.onToggleKopierEpostModal}
                    kandidater={this.state.kandidater.filter(kandidat => kandidat.markert)}
                />
                <HjelpetekstFading
                    synlig={suksessMelding.vis}
                    type="suksess"
                    innhold={suksessMelding.tekst}
                />
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
                    onEmailKandidater={this.onEmailKandidater}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                    onVisningChange={this.onVisningChange}
                    opprettNotat={this.props.opprettNotat}
                    endreNotat={this.props.endreNotat}
                    slettNotat={this.props.slettNotat}
                    toggleErSlettet={this.props.toggleErSlettet}
                    beskrivelse={beskrivelse}
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
        etternavn: '',
    },
};

Listedetaljer.propTypes = {
    kandidatliste: PropTypes.shape({
        kind: PropTypes.string,
        data: PropTypes.shape(Kandidatliste),
    }),
    endreStatusKandidat: PropTypes.func.isRequired,
    presenterKandidater: PropTypes.func.isRequired,
    resetDeleStatus: PropTypes.func.isRequired,
    deleStatus: PropTypes.string.isRequired,
    leggTilStatus: PropTypes.string.isRequired,
    fodselsnummer: PropTypes.string,
    kandidat: PropTypes.shape({
        fornavn: PropTypes.string,
        etternavn: PropTypes.string,
    }),
    hentNotater: PropTypes.func.isRequired,
    opprettNotat: PropTypes.func.isRequired,
    endreNotat: PropTypes.func.isRequired,
    slettNotat: PropTypes.func.isRequired,
    toggleErSlettet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
});

const mapDispatchToProps = dispatch => ({
    endreStatusKandidat: (status, kandidatlisteId, kandidatnr) => {
        dispatch({
            type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        });
    },
    presenterKandidater: (beskjed, mailadresser, kandidatlisteId, kandidatnummerListe) => {
        dispatch({
            type: KandidatlisteTypes.PRESENTER_KANDIDATER,
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe,
        });
    },
    resetDeleStatus: () => {
        dispatch({ type: KandidatlisteTypes.RESET_DELE_STATUS });
    },
    hentNotater: (kandidatlisteId, kandidatnr) => {
        dispatch({ type: KandidatlisteTypes.HENT_NOTATER, kandidatlisteId, kandidatnr });
    },
    opprettNotat: (kandidatlisteId, kandidatnr, tekst) => {
        dispatch({ type: KandidatlisteTypes.OPPRETT_NOTAT, kandidatlisteId, kandidatnr, tekst });
    },
    endreNotat: (kandidatlisteId, kandidatnr, notatId, tekst) => {
        dispatch({
            type: KandidatlisteTypes.ENDRE_NOTAT,
            kandidatlisteId,
            kandidatnr,
            notatId,
            tekst,
        });
    },
    slettNotat: (kandidatlisteId, kandidatnr, notatId) => {
        dispatch({ type: KandidatlisteTypes.SLETT_NOTAT, kandidatlisteId, kandidatnr, notatId });
    },
    toggleErSlettet: (kandidatlisteId, kandidatnr, erSlettet) => {
        dispatch({
            type: KandidatlisteTypes.TOGGLE_ER_SLETTET,
            kandidatlisteId,
            kandidatnr,
            erSlettet,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Listedetaljer);
