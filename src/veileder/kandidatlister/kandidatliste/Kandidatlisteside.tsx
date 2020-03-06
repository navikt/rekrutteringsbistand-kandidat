/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import {
    Kandidat,
    KandidatIKandidatliste,
    KandidatlisteAction,
} from '../reducer/kandidatlisteReducer';
import { DELE_STATUS } from '../reducer/kandidatlisteReducer';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import { OpprettetAv } from './SideHeader';
import { RemoteDataTypes } from '../../../felles/common/remoteData';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import { Visningsstatus } from './Kandidatliste';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading';
import Kandidatliste from './Kandidatliste';
import KopierEpostModal from './KopierEpostModal';
import LeggTilKandidatModal from './LeggTilKandidatModal';
import PresenterKandidaterModal from './PresenterKandidaterModal';
import './Kandidatliste.less';
import KandidatlisteTypes from '../reducer/KandidatlisteTypes';

const initialKandidatTilstand = () => ({
    markert: false,
    visningsstatus: Visningsstatus.SkjulPanel,
});

const trekkUtKandidatTilstander = (kandidater = []) =>
    kandidater.reduce(
        (tilstand: any, kandidat: KandidatIKandidatliste) => ({
            ...tilstand,
            [kandidat.kandidatnr]: {
                markert: kandidat.markert,
                visningsstatus: kandidat.visningsstatus,
            },
        }),
        {}
    );

type Kandidatliste = {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse?: string;
    organisasjonReferanse?: string;
    organisasjonNavn?: string;
    stillingId?: string;
    opprettetAv: OpprettetAv;
    opprettetTidspunkt?: string;
    kandidater: Kandidat[];
    kanEditere: boolean;
};

type RemoteKandidatliste = {
    kind: RemoteDataTypes;
    data: Kandidatliste;
};

type Props = {
    kandidatliste: RemoteKandidatliste;
    endreStatusKandidat: any;
    presenterKandidater: any;
    resetDeleStatus: any;
    deleStatus: string;
    leggTilStatus: string;
    fodselsnummer?: string;
    kandidat: {
        fornavn?: string;
        etternavn?: string;
    };
    hentNotater: any;
    opprettNotat: any;
    endreNotat: any;
    slettNotat: any;
    toggleErSlettet: any;
};

class Kandidatlisteside extends React.Component<Props> {
    deleSuksessMeldingCallbackId: any;

    static defaultProps: Partial<Props> = {
        kandidat: {
            fornavn: '',
            etternavn: '',
        },
    };

    state: {
        alleMarkert: boolean;
        kandidater: any;
        deleModalOpen: boolean;
        leggTilModalOpen: boolean;
        kopierEpostModalOpen: boolean;
        suksessMelding: {
            vis: boolean;
            tekst: string;
        };
    };

    constructor(props: Props) {
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

    componentDidUpdate(prevProps: Props) {
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

    onToggleKandidat = (kandidatnr: string) => {
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
        if (visningsstatus === Visningsstatus.VisNotater) {
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
                    visningsstatus: Visningsstatus.SkjulPanel,
                };
            }),
        });
    };

    onEmailKandidater = () => {
        this.setState({
            kopierEpostModalOpen: true,
        });
    };

    copyToClipboard = (text: string) => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    visSuccessMelding = (tekst: string) => {
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
                <Kandidatliste
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

const mapStateToProps = (state: any) => ({
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
});

const mapDispatchToProps = (dispatch: (action: KandidatlisteAction) => void) => ({
    endreStatusKandidat: (status: Status, kandidatlisteId: string, kandidatnr: string) => {
        dispatch({
            type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        });
    },
    presenterKandidater: (
        beskjed: string,
        mailadresser: Array<string>,
        kandidatlisteId: string,
        kandidatnummerListe: Array<string>
    ) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteside);
