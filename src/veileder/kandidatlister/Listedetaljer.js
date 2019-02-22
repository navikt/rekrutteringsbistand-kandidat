/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
    DELE_STATUS,
    ENDRE_NOTAT,
    ENDRE_STATUS_KANDIDAT,
    HENT_KANDIDATLISTE,
    HENT_NOTATER,
    OPPRETT_NOTAT,
    PRESENTER_KANDIDATER,
    RESET_DELE_STATUS,
    SLETT_NOTAT
} from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import PresenterKandidaterModal from './PresenterKandidaterModal';
import LeggTilKandidatModal from './LeggTilKandidatModal';
import ListedetaljerView, { VISNINGSSTATUS } from './ListedetaljerView';
import KopierEpostModal from './KopierEpostModal';
import { Kandidatliste, Notat } from './PropTypes';
import './Listedetaljer.less';

const initialKandidatTilstand = () => ({
    markert: false,
    visningsstatus: VISNINGSSTATUS.SKJUL_PANEL,
    notater: undefined
});

const trekkUtKandidatTilstander = (kandidater = []) => (
    kandidater.reduce((tilstand, kandidat) => ({
        ...tilstand,
        [kandidat.kandidatnr]: {
            markert: kandidat.markert,
            visningsstatus: kandidat.visningsstatus,
            notater: kandidat.notater
        }
    }),
    {}
    )
);

class Listedetaljer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleMarkert: false,
            kandidater: props.kandidatliste === undefined ? undefined :
                props.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    ...initialKandidatTilstand()
                })),
            deleModalOpen: false,
            leggTilModalOpen: false,
            kopierEpostModalOpen: false,
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
        const kandidaterHarNettoppBlittPresentert = this.props.deleStatus !== prevProps.deleStatus && this.props.deleStatus === DELE_STATUS.SUCCESS;
        if (kandidaterHarNettoppBlittPresentert) {
            this.props.resetDeleStatus();
            const antallMarkerteKandidater = this.state.kandidater.filter((kandidat) => kandidat.markert).length;
            this.visSuccessMelding(`${antallMarkerteKandidater > 1 ? 'Kandidatene' : 'Kandidaten'} er delt med arbeidsgiver`);
        }
        if (this.props.leggTilStatus !== prevProps.leggTilStatus && this.props.leggTilStatus === LAGRE_STATUS.SUCCESS) {
            this.visSuccessMelding(`Kandidat ${this.props.kandidat.fornavn} ${this.props.kandidat.etternavn} (${this.props.fodselsnummer}) er lagt til`);
        }
        if (!this.props.kandidatliste) {
            return;
        }
        if ((!prevProps.kandidatliste && this.props.kandidatliste.kandidater)
            || prevProps.kandidatliste.kandidater !== this.props.kandidatliste.kandidater) {
            const kandidatTilstander = trekkUtKandidatTilstander(this.state.kandidater);
            this.setState({
                kandidater: this.props.kandidatliste.kandidater.map((kandidat) => {
                    const kandidatTilstand = (!kandidaterHarNettoppBlittPresentert && kandidatTilstander[kandidat.kandidatnr]) || initialKandidatTilstand();
                    return {
                        ...kandidat,
                        ...kandidatTilstand
                    };
                }),
                alleMarkert: !kandidaterHarNettoppBlittPresentert && this.props.kandidatliste.kandidater.filter((k) => !k.markert).length === 0
            });
        }
        if (this.props.notaterForKandidat && this.props.notaterForKandidat !== prevProps.notaterForKandidat) {
            this.setState({
                kandidater: this.state.kandidater.map((kandidat) => {
                    if (kandidat.kandidatnr === this.props.notaterForKandidat.kandidatnr) {
                        return {
                            ...kandidat,
                            notater: this.props.notaterForKandidat.notater
                        };
                    }
                    return kandidat;
                })
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

    onToggleKopierEpostModal = () => {
        this.setState({
            kopierEpostModalOpen: !this.state.kopierEpostModalOpen
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

    onVisningChange = (visningsstatus, kandidatlisteId, kandidatnr) => {
        if (visningsstatus === VISNINGSSTATUS.VIS_NOTATER) {
            this.props.hentNotater(kandidatlisteId, kandidatnr);
        }
        this.setState({
            kandidater: this.state.kandidater
                .map((kandidat) => {
                    if (kandidat.kandidatnr === kandidatnr) {
                        return {
                            ...kandidat,
                            visningsstatus
                        };
                    }
                    return {
                        ...kandidat,
                        visningsstatus: VISNINGSSTATUS.SKJUL_PANEL
                    };
                })
        });
    };

    onEmailKandidater = () => {
        const epostStreng = this.state.kandidater
            .filter((kandidat) => (kandidat.markert && kandidat.epost))
            .map((kandidat) => `${kandidat.epost}`)
            .join(';');
        this.setState({
            kopierEpostModalOpen: true
        });
        this.copyToClipboard(epostStreng);
    };

    copyToClipboard = (text) => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
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
        const { kandidater, alleMarkert, deleModalOpen, suksessMelding, leggTilModalOpen, kopierEpostModalOpen } = this.state;
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
                {kopierEpostModalOpen &&
                    <KopierEpostModal
                        vis={this.state.kopierEpostModalOpen}
                        onClose={this.onToggleKopierEpostModal}
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
                    onEmailKandidater={this.onEmailKandidater}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                    onVisningChange={this.onVisningChange}
                    opprettNotat={this.props.opprettNotat}
                    endreNotat={this.props.endreNotat}
                    slettNotat={this.props.slettNotat}
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
    },
    notaterForKandidat: undefined
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
    }).isRequired,
    hentNotater: PropTypes.func.isRequired,
    opprettNotat: PropTypes.func.isRequired,
    endreNotat: PropTypes.func.isRequired,
    slettNotat: PropTypes.func.isRequired,
    notaterForKandidat: PropTypes.shape({
        kandidatnr: PropTypes.string,
        notater: PropTypes.arrayOf(PropTypes.shape(Notat))
    })
};

const mapStateToProps = (state) => ({
    fetching: state.kandidatlister.detaljer.fetching,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
    notaterForKandidat: state.kandidatlister.notater
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (stillingsnummer) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer }); },
    endreStatusKandidat: (status, kandidatlisteId, kandidatnr) => { dispatch({ type: ENDRE_STATUS_KANDIDAT, status, kandidatlisteId, kandidatnr }); },
    presenterKandidater: (beskjed, mailadresser, kandidatlisteId, kandidatnummerListe) => { dispatch({ type: PRESENTER_KANDIDATER, beskjed, mailadresser, kandidatlisteId, kandidatnummerListe }); },
    resetDeleStatus: () => { dispatch({ type: RESET_DELE_STATUS }); },
    hentNotater: (kandidatlisteId, kandidatnr) => { dispatch({ type: HENT_NOTATER, kandidatlisteId, kandidatnr }); },
    opprettNotat: (kandidatlisteId, kandidatnr, tekst) => { dispatch({ type: OPPRETT_NOTAT, kandidatlisteId, kandidatnr, tekst }); },
    endreNotat: (kandidatlisteId, kandidatnr, notatId, tekst) => { dispatch({ type: ENDRE_NOTAT, kandidatlisteId, kandidatnr, notatId, tekst }); },
    slettNotat: (kandidatlisteId, kandidatnr, notatId) => { dispatch({ type: SLETT_NOTAT, kandidatlisteId, kandidatnr, notatId }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Listedetaljer);

