/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { LAGRE_STATUS } from '../../../felles/konstanter';
import { Nettstatus, RemoteData } from '../../../felles/common/remoteData';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import Kandidatliste, { Visningsstatus } from './Kandidatliste';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading';
import KopierEpostModal from './modaler/KopierEpostModal';
import LeggTilKandidatModal from './modaler/LeggTilKandidatModal';
import PresenterKandidaterModal from './modaler/PresenterKandidaterModal';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import {
    Delestatus,
    KandidatIKandidatliste,
    Kandidatliste as Kandidatlistetype,
    Kandidattilstand,
    Sms,
    SmsStatus,
} from '../kandidatlistetyper';
import { sendEvent } from '../../amplitude/amplitude';
import './Kandidatliste.less';
import SendSmsModal from '../modaler/SendSmsModal';
import AppState from '../../AppState';
import EndreUtfallModal from './modaler/EndreUtfallModal';
import { Utfall } from './kandidatrad/utfall-select/UtfallSelect';

const initialKandidatTilstand = (): Kandidattilstand => ({
    markert: false,
    visningsstatus: Visningsstatus.SkjulPanel,
});

type Kandidattilstander = {
    [kandidatnr: string]: Kandidattilstand;
};

const trekkUtKandidatTilstander = (kandidater: KandidatIKandidatliste[] = []): Kandidattilstander =>
    kandidater.reduce(
        (tilstand: Kandidattilstander, kandidat: KandidatIKandidatliste) => ({
            ...tilstand,
            [kandidat.kandidatnr]: {
                markert: kandidat.markert,
                visningsstatus: kandidat.visningsstatus,
            },
        }),
        {}
    );

type Props = {
    kandidatliste: RemoteData<Kandidatlistetype>;
    sendteMeldinger: RemoteData<Sms[]>;
    endreStatusKandidat: any;
    endreUtfallKandidat: (
        utfall: Utfall,
        navKontor: string,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
    presenterKandidater: (
        beskjed: string,
        mailadresser: Array<string>,
        kandidatlisteId: string,
        kandidatnummerListe: Array<string>,
        navKontor: string
    ) => void;
    resetDeleStatus: any;
    deleStatus: string;
    smsSendStatus: SmsStatus;
    resetSmsSendStatus: () => void;
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
    hentSendteMeldinger: (kandidatlisteId: string) => void;
    toggleArkivert: (kandidatlisteId: string, kandidatnr: string, arkivert: boolean) => void;
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => void;
    statusArkivering: Nettstatus;
    statusDearkivering: Nettstatus;
    midlertidigUtilgjengeligEndretTidspunkt: any;
    sistValgteKandidat?: {
        kandidatlisteId: string;
        kandidatnr: string;
    };
    valgtNavKontor: string;
};

class Kandidatlisteside extends React.Component<Props> {
    infobannerCallbackId: any;

    static defaultProps: Partial<Props> = {
        kandidat: {
            fornavn: '',
            etternavn: '',
        },
    };

    state: {
        kandidater?: KandidatIKandidatliste[];
        deleModalOpen: boolean;
        leggTilModalOpen: boolean;
        kopierEpostModalOpen: boolean;
        sendSmsModalOpen: boolean;
        endreUtfallModal: {
            open: boolean;
            kandidat?: KandidatIKandidatliste;
            utfall?: Utfall;
        };
        infobanner: {
            vis: boolean;
            tekst: string;
            type: 'suksess' | 'feil';
        };
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            kandidater:
                props.kandidatliste.kind !== Nettstatus.Suksess
                    ? undefined
                    : props.kandidatliste.data.kandidater.map((kandidat) => ({
                          ...kandidat,
                          ...initialKandidatTilstand(),
                      })),
            deleModalOpen: false,
            leggTilModalOpen: false,
            kopierEpostModalOpen: false,
            sendSmsModalOpen: false,
            endreUtfallModal: {
                open: false,
            },
            infobanner: {
                vis: false,
                tekst: '',
                type: 'suksess',
            },
        };
        if (props.midlertidigUtilgjengeligEndretTidspunkt) {
            const tid = Date.now() - props.midlertidigUtilgjengeligEndretTidspunkt;
            if (tid < 10000) {
                sendEvent('kandidatliste', 'fra_midlertidig_utilgjengelig', { tid: tid });
            }
        }
    }

    componentDidUpdate(prevProps: Props) {
        const kandidaterHarNettoppBlittPresentert =
            this.props.deleStatus !== prevProps.deleStatus &&
            this.props.deleStatus === Delestatus.Success;

        const smsErNettoppSendtTilKandidater =
            this.props.smsSendStatus !== prevProps.smsSendStatus &&
            this.props.smsSendStatus === SmsStatus.Sendt;

        const kandidaterHarNettoppBlittLagtTil =
            this.props.leggTilStatus !== prevProps.leggTilStatus &&
            this.props.leggTilStatus === LAGRE_STATUS.SUCCESS;

        const feilMedSmsUtsending =
            this.props.smsSendStatus !== prevProps.smsSendStatus &&
            this.props.smsSendStatus === SmsStatus.Feil;

        const kandidatlisteErIkkeLastet = this.props.kandidatliste.kind !== Nettstatus.Suksess;

        const enKandidatErNettoppArkivert =
            prevProps.statusArkivering === Nettstatus.LasterInn &&
            this.props.statusArkivering === Nettstatus.Suksess;

        const arkiveringFeiletNettopp =
            prevProps.statusArkivering === Nettstatus.LasterInn &&
            this.props.statusArkivering === Nettstatus.Feil;

        const enKandidatErNettoppDearkivert =
            prevProps.statusDearkivering === Nettstatus.LasterInn &&
            this.props.statusDearkivering === Nettstatus.Suksess;

        const dearkiveringFeiletNettopp =
            prevProps.statusDearkivering === Nettstatus.LasterInn &&
            this.props.statusDearkivering === Nettstatus.Feil;

        const kandidatlistenVarIkkeLastet = prevProps.kandidatliste.kind !== Nettstatus.Suksess;

        if (kandidaterHarNettoppBlittPresentert) {
            this.props.resetDeleStatus();

            const antallMarkerteKandidater = (this.state.kandidater || []).filter(
                (kandidat) => kandidat.markert
            ).length;

            this.fjernAllMarkering();
            this.visInfobanner(
                `${
                    antallMarkerteKandidater > 1 ? 'Kandidatene' : 'Kandidaten'
                } er delt med arbeidsgiver`
            );
        }
        if (kandidaterHarNettoppBlittLagtTil) {
            this.visInfobanner(
                `Kandidat ${this.props.kandidat.fornavn} ${this.props.kandidat.etternavn} (${this.props.fodselsnummer}) er lagt til`
            );
        }

        if (enKandidatErNettoppArkivert) {
            this.visInfobanner(`Kandidaten ble slettet`);
        }

        if (arkiveringFeiletNettopp) {
            this.visInfobanner(`Det skjedde noe galt under sletting av kandidaten`);
        }

        if (enKandidatErNettoppDearkivert) {
            this.visInfobanner(`Kandidaten ble lagt tilbake i kandidatlisten`);
        }

        if (dearkiveringFeiletNettopp) {
            this.visInfobanner(
                `Det skjedde noe galt, kunne ikke legge kandidaten tilbake i kandidatlisten`
            );
        }

        if (smsErNettoppSendtTilKandidater) {
            this.props.resetSmsSendStatus();
            this.visInfobanner('SMS-en er sendt');
            this.fjernAllMarkering();
            this.setState({
                sendSmsModalOpen: false,
            });
        }

        if (feilMedSmsUtsending) {
            this.props.resetSmsSendStatus();
            this.visInfobanner('Det skjedde en feil', 'feil');
            this.setState({
                sendSmsModalOpen: false,
            });
        }

        if (kandidatlisteErIkkeLastet) {
            return;
        }

        if (this.props.kandidatliste.kind === Nettstatus.Suksess && kandidatlistenVarIkkeLastet) {
            const { sistValgteKandidat, kandidatliste } = this.props;
            const ingenKandidatHarBlittValgt =
                !sistValgteKandidat ||
                sistValgteKandidat.kandidatlisteId !== kandidatliste.data.kandidatlisteId;

            if (ingenKandidatHarBlittValgt) {
                window.scrollTo(0, 0);
            }
        }

        if (
            this.props.kandidatliste.kind === Nettstatus.Suksess &&
            (kandidatlistenVarIkkeLastet || smsErNettoppSendtTilKandidater)
        ) {
            this.props.hentSendteMeldinger(this.props.kandidatliste.data.kandidatlisteId);
        }

        const sendteMeldingerErNettoppLastet =
            prevProps.sendteMeldinger.kind === Nettstatus.LasterInn &&
            this.props.sendteMeldinger.kind === Nettstatus.Suksess;

        if (
            this.props.kandidatliste.kind === Nettstatus.Suksess &&
            (kandidatlistenVarIkkeLastet ||
                sendteMeldingerErNettoppLastet ||
                (prevProps.kandidatliste.kind === Nettstatus.Suksess &&
                    prevProps.kandidatliste.data.kandidater !==
                        this.props.kandidatliste.data.kandidater))
        ) {
            const kandidatTilstander: Kandidattilstander = trekkUtKandidatTilstander(
                this.state.kandidater
            );

            const sendteMeldinger =
                this.props.sendteMeldinger.kind === Nettstatus.Suksess
                    ? this.props.sendteMeldinger.data
                    : [];

            const kandidater = this.props.kandidatliste.data.kandidater.map((kandidat) => {
                const kandidatTilstand =
                    (!kandidaterHarNettoppBlittPresentert &&
                        kandidatTilstander[kandidat.kandidatnr]) ||
                    initialKandidatTilstand();

                const sendtMelding = sendteMeldinger.find(
                    (melding) => melding.fnr === kandidat.fodselsnr
                );

                return {
                    ...kandidat,
                    ...kandidatTilstand,
                    sms: sendtMelding,
                };
            });

            this.setState({
                kandidater,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.infobannerCallbackId);
    }

    fjernAllMarkering = () => {
        if (this.state.kandidater) {
            this.setState({
                kandidater: this.state.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false,
                })),
            });
        }
    };

    toggleMarkert = (kandidatnr: string) => {
        if (this.state.kandidater) {
            const kandidater = this.state.kandidater.map((kandidat) => {
                return kandidat.kandidatnr !== kandidatnr
                    ? kandidat
                    : {
                          ...kandidat,
                          markert: !kandidat.markert,
                      };
            });
            this.setState({
                kandidater,
            });
        }
    };

    markerKandidater = (kandidatnumre: string[]) => {
        if (this.state.kandidater) {
            const kandidater = this.state.kandidater.map((kandidat) => ({
                ...kandidat,
                markert: kandidatnumre.includes(kandidat.kandidatnr),
            }));

            this.setState({
                kandidater,
            });
        }
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

    onToggleSendSmsModal = (vis: boolean = !this.state.sendSmsModalOpen) => {
        this.setState({
            sendSmsModalOpen: vis,
        });
    };

    onDelMedArbeidsgiver = (beskjed, mailadresser) => {
        if (this.state.kandidater) {
            if (this.props.kandidatliste.kind === Nettstatus.Suksess) {
                const kandidatNrTilPresentering = this.state.kandidater
                    .filter((kandidat) => kandidat.markert)
                    .map((kandidat) => kandidat.kandidatnr);

                sendEvent('kandidatliste', 'presenter_kandidater', {
                    antallKandidater: kandidatNrTilPresentering.length,
                });

                this.props.presenterKandidater(
                    beskjed,
                    mailadresser,
                    this.props.kandidatliste.data.kandidatlisteId,
                    kandidatNrTilPresentering,
                    this.props.valgtNavKontor
                );
                this.setState({
                    deleModalOpen: false,
                });
            }
        }
    };

    onKandidaterAngreArkivering = () => {
        if (this.state.kandidater) {
            if (this.props.kandidatliste.kind === Nettstatus.Suksess) {
                this.props.angreArkiveringForKandidater(
                    this.props.kandidatliste.data.kandidatlisteId,
                    this.state.kandidater
                        .filter((kandidat) => kandidat.markert)
                        .map((kandidat) => kandidat.kandidatnr)
                );
            }
        }
    };

    onVisningChange = (visningsstatus, kandidatlisteId, kandidatnr) => {
        if (this.state.kandidater) {
            if (visningsstatus === Visningsstatus.VisNotater) {
                this.props.hentNotater(kandidatlisteId, kandidatnr);
            }
            this.setState({
                kandidater: this.state.kandidater.map((kandidat) => {
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
        }
    };

    onEmailKandidater = () => {
        this.setState({
            kopierEpostModalOpen: true,
        });
    };

    endreUtfallForKandidat = (utfall: Utfall, kandidatnr: string) => {
        if (this.props.kandidatliste.kind === Nettstatus.Suksess) {
            const kandidatlisteId = this.props.kandidatliste.data.kandidatlisteId;
            this.props.endreUtfallKandidat(
                utfall,
                this.props.valgtNavKontor,
                kandidatlisteId,
                kandidatnr
            );
        }
    };

    bekreftModalOgEndreUtfallForKandidat = () => {
        if (this.state.endreUtfallModal.utfall && this.state.endreUtfallModal.kandidat) {
            sendEvent('kandidatliste', 'endre_utfall', {
                utfall: this.state.endreUtfallModal.utfall,
                forrigeUtfall: undefined, // TODO: Logg forrige utfall
            });

            this.endreUtfallForKandidat(
                this.state.endreUtfallModal.utfall,
                this.state.endreUtfallModal.kandidat.kandidatnr
            );

            this.lukkEndreUtfallModal();
        }
    };

    onKandidatUtfallChange = (
        utfall: Utfall,
        kandidat: KandidatIKandidatliste,
        visModal: boolean
    ) => {
        if (visModal) {
            this.setState({
                endreUtfallModal: {
                    open: true,
                    kandidat,
                    utfall,
                },
            });
        } else {
            this.endreUtfallForKandidat(utfall, kandidat.kandidatnr);
        }
    };

    lukkEndreUtfallModal = () => {
        this.setState({
            endreUtfallModal: {
                open: false,
            },
        });
    };

    visInfobanner = (tekst: string, type = 'suksess') => {
        clearTimeout(this.infobannerCallbackId);
        this.setState({
            infobanner: {
                vis: true,
                tekst,
                type,
            },
        });
        this.infobannerCallbackId = setTimeout(() => {
            this.setState({
                infobanner: {
                    vis: false,
                    tekst: '',
                },
            });
        }, 5000);
    };

    render() {
        if (this.props.kandidatliste.kind === Nettstatus.LasterInn || !this.state.kandidater) {
            return (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        } else if (this.props.kandidatliste.kind !== Nettstatus.Suksess) {
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
            deleModalOpen,
            infobanner,
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
                        antallKandidater={kandidater.filter((kandidat) => kandidat.markert).length}
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
                {stillingId && (
                    <>
                        <SendSmsModal
                            vis={this.state.sendSmsModalOpen}
                            onClose={() => this.onToggleSendSmsModal(false)}
                            kandidatlisteId={kandidatlisteId}
                            kandidater={this.state.kandidater}
                            stillingId={stillingId}
                        />
                        {this.state.endreUtfallModal.kandidat &&
                            this.state.endreUtfallModal.utfall && (
                                <EndreUtfallModal
                                    vis={this.state.endreUtfallModal.open}
                                    onLukk={this.lukkEndreUtfallModal}
                                    kandidat={this.state.endreUtfallModal.kandidat}
                                    utfall={this.state.endreUtfallModal.utfall}
                                    onBekreft={this.bekreftModalOgEndreUtfallForKandidat}
                                />
                            )}
                    </>
                )}
                <KopierEpostModal
                    vis={kopierEpostModalOpen}
                    onClose={this.onToggleKopierEpostModal}
                    kandidater={this.state.kandidater.filter((kandidat) => kandidat.markert)}
                />
                <HjelpetekstFading
                    synlig={infobanner.vis}
                    type={infobanner.type}
                    innhold={infobanner.tekst}
                />
                <Kandidatliste
                    tittel={tittel}
                    arbeidsgiver={organisasjonNavn}
                    opprettetAv={opprettetAv}
                    kandidatlisteId={kandidatlisteId}
                    stillingsId={stillingId}
                    kanEditere={kanEditere}
                    kandidater={kandidater}
                    toggleMarkert={this.toggleMarkert}
                    fjernAllMarkering={this.fjernAllMarkering}
                    markerKandidater={this.markerKandidater}
                    onKandidatStatusChange={this.props.endreStatusKandidat}
                    onKandidatUtfallChange={this.onKandidatUtfallChange}
                    onKandidatShare={this.onToggleDeleModal}
                    onEmailKandidater={this.onEmailKandidater}
                    onKandidaterAngreArkivering={this.onKandidaterAngreArkivering}
                    onSendSmsClick={() => this.onToggleSendSmsModal(true)}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                    onVisningChange={this.onVisningChange}
                    opprettNotat={this.props.opprettNotat}
                    endreNotat={this.props.endreNotat}
                    slettNotat={this.props.slettNotat}
                    beskrivelse={beskrivelse}
                    toggleArkivert={this.props.toggleArkivert}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    smsSendStatus: state.kandidatlister.sms.sendStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
    sendteMeldinger: state.kandidatlister.sms.sendteMeldinger,
    statusArkivering: state.kandidatlister.arkivering.statusArkivering,
    statusDearkivering: state.kandidatlister.arkivering.statusDearkivering,
    sistValgteKandidat: state.kandidatlister.sistValgteKandidat,
    midlertidigUtilgjengeligEndretTidspunkt: state.midlertidigUtilgjengelig.endretTidspunkt,
    valgtNavKontor: state.navKontor.valgtNavKontor,
});

const mapDispatchToProps = (dispatch: (action: KandidatlisteAction) => void) => ({
    endreStatusKandidat: (status: Status, kandidatlisteId: string, kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        });
    },
    endreUtfallKandidat: (
        utfall: Utfall,
        navKontor: string,
        kandidatlisteId: string,
        kandidatnr: string
    ) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT,
            utfall,
            navKontor,
            kandidatlisteId,
            kandidatnr,
        });
    },
    presenterKandidater: (
        beskjed: string,
        mailadresser: Array<string>,
        kandidatlisteId: string,
        kandidatnummerListe: Array<string>,
        navKontor: string
    ) => {
        dispatch({
            type: KandidatlisteActionType.PRESENTER_KANDIDATER,
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe,
            navKontor,
        });
    },
    resetDeleStatus: () => {
        dispatch({ type: KandidatlisteActionType.RESET_DELESTATUS });
    },
    resetSmsSendStatus: () => {
        dispatch({ type: KandidatlisteActionType.RESET_SEND_SMS_STATUS });
    },
    hentNotater: (kandidatlisteId, kandidatnr) => {
        dispatch({ type: KandidatlisteActionType.HENT_NOTATER, kandidatlisteId, kandidatnr });
    },
    opprettNotat: (kandidatlisteId, kandidatnr, tekst) => {
        dispatch({
            type: KandidatlisteActionType.OPPRETT_NOTAT,
            kandidatlisteId,
            kandidatnr,
            tekst,
        });
    },
    endreNotat: (kandidatlisteId, kandidatnr, notatId, tekst) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_NOTAT,
            kandidatlisteId,
            kandidatnr,
            notatId,
            tekst,
        });
    },
    slettNotat: (kandidatlisteId, kandidatnr, notatId) => {
        dispatch({
            type: KandidatlisteActionType.SLETT_NOTAT,
            kandidatlisteId,
            kandidatnr,
            notatId,
        });
    },
    toggleArkivert: (kandidatlisteId, kandidatnr, arkivert) => {
        dispatch({
            type: KandidatlisteActionType.TOGGLE_ARKIVERT,
            kandidatlisteId,
            kandidatnr,
            arkivert,
        });
    },
    hentSendteMeldinger: (kandidatlisteId: string) => {
        dispatch({
            type: KandidatlisteActionType.HENT_SENDTE_MELDINGER,
            kandidatlisteId,
        });
    },
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => {
        dispatch({
            type: KandidatlisteActionType.ANGRE_ARKIVERING,
            kandidatlisteId,
            kandidatnumre,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteside);
