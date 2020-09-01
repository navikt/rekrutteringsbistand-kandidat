import React from 'react';
import { connect } from 'react-redux';

import {
    Delestatus,
    Kandidatliste as Kandidatlistetype,
    SmsStatus,
    KandidatIKandidatliste,
} from './kandidatlistetyper';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { Kandidatlistefilter } from './kandidatlistetyper';
import { Nettstatus, Nettressurs } from '../../felles/common/remoteData';
import { sendEvent } from '../amplitude/amplitude';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import { Utfall } from './kandidatrad/utfall-select/UtfallSelect';
import AppState from '../AppState';
import EndreUtfallModal from './modaler/EndreUtfallModal';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import Kandidatliste, { Visningsstatus } from './Kandidatliste';
import KandidatlisteAction from './reducer/KandidatlisteAction';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import KopierEpostModal from './modaler/KopierEpostModal';
import PresenterKandidaterModal from './modaler/PresenterKandidaterModal';
import SendSmsModal from './modaler/SendSmsModal';
import './Kandidatliste.less';
import { Kandidatresultat } from '../kandidatside/cv/reducer/cv-typer';
import LeggTilKandidatModal, {
    FormidlingAvUsynligKandidatOutboundDto,
} from './modaler/legg-til-kandidat-modal/LeggTilKandidatModal';

type OwnProps = {
    kandidatliste: Kandidatlistetype;
    kandidater: KandidatIKandidatliste[];
};

type ConnectedProps = {
    filter: Kandidatlistefilter;
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
    resetDeleStatus: () => void;
    deleStatus: Delestatus;
    smsSendStatus: SmsStatus;
    resetSmsSendStatus: () => void;
    leggTilStatus: string;
    fodselsnummer?: string;
    kandidat?: Kandidatresultat;
    hentNotater: any;
    toggleArkivert: (kandidatlisteId: string, kandidatnr: string, arkivert: boolean) => void;
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => void;
    statusArkivering: Nettstatus;
    statusDearkivering: Nettstatus;
    midlertidigUtilgjengeligEndretTidspunkt: any;
    valgtNavKontor: string;
    toggleMarkeringAvKandidat: (kandidatnr: string) => void;
    endreMarkeringAvKandidater: (kandidatnumre: string[]) => void;
    endreVisningsstatusKandidat: (kandidatnr: string, visningsstatus: Visningsstatus) => void;
    formidlingAvUsynligKandidat: Nettressurs<FormidlingAvUsynligKandidatOutboundDto>;
};

type Props = ConnectedProps & OwnProps;

class KandidatlisteOgModaler extends React.Component<Props> {
    infobannerCallbackId: any;

    state: {
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

        const usynligKandidatHarNettoppBlittRegistrert =
            this.props.formidlingAvUsynligKandidat.kind !==
                prevProps.formidlingAvUsynligKandidat.kind &&
            this.props.formidlingAvUsynligKandidat.kind === Nettstatus.Suksess;

        const feilMedSmsUtsending =
            this.props.smsSendStatus !== prevProps.smsSendStatus &&
            this.props.smsSendStatus === SmsStatus.Feil;

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

        if (kandidaterHarNettoppBlittPresentert) {
            this.props.resetDeleStatus();

            const antallMarkerteKandidater = (this.props.kandidater || []).filter(
                (kandidat) => kandidat.tilstand.markert
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
                `Kandidat ${this.props.kandidat?.fornavn} ${this.props.kandidat?.etternavn} (${this.props.fodselsnummer}) er lagt til`
            );
        }

        if (usynligKandidatHarNettoppBlittRegistrert) {
            if (this.props.formidlingAvUsynligKandidat.kind === Nettstatus.Suksess) {
                this.visInfobanner(
                    `Kandidaten med fødselsnummer ${this.props.formidlingAvUsynligKandidat.data.fnr} har blitt registrert`
                );
                this.onToggleLeggTilKandidatModal();
            }
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
    }

    componentWillUnmount() {
        clearTimeout(this.infobannerCallbackId);
    }

    fjernAllMarkering = () => {
        this.props.endreMarkeringAvKandidater([]);
    };

    toggleMarkert = (kandidatnr: string) => {
        this.props.toggleMarkeringAvKandidat(kandidatnr);
    };

    markerKandidater = (kandidatnumre: string[]) => {
        this.props.endreMarkeringAvKandidater(kandidatnumre);
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

    onDelMedArbeidsgiver = (beskjed: string, mailadresser: string[]) => {
        const kandidatNrTilPresentering = this.props.kandidater
            .filter((kandidat) => kandidat.tilstand.markert)
            .map((kandidat) => kandidat.kandidatnr);

        sendEvent('kandidatliste', 'presenter_kandidater', {
            antallKandidater: kandidatNrTilPresentering.length,
        });

        this.props.presenterKandidater(
            beskjed,
            mailadresser,
            this.props.kandidatliste.kandidatlisteId,
            kandidatNrTilPresentering,
            this.props.valgtNavKontor
        );
        this.setState({
            deleModalOpen: false,
        });
    };

    onKandidaterAngreArkivering = () => {
        this.props.angreArkiveringForKandidater(
            this.props.kandidatliste.kandidatlisteId,
            this.props.kandidater
                .filter((kandidat) => kandidat.tilstand.markert)
                .map((kandidat) => kandidat.kandidatnr)
        );
    };

    onVisningChange = (visningsstatus: Visningsstatus, kandidatnr: string) => {
        if (visningsstatus === Visningsstatus.VisNotater) {
            this.props.hentNotater(this.props.kandidatliste.kandidatlisteId, kandidatnr);
        }

        this.props.endreVisningsstatusKandidat(kandidatnr, visningsstatus);
    };

    onEmailKandidater = () => {
        this.setState({
            kopierEpostModalOpen: true,
        });
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
            this.endreUtfallForKandidat(utfall, kandidat);
        }
    };

    endreUtfallForKandidat = (utfall: Utfall, kandidat: KandidatIKandidatliste) => {
        const kandidatlisteId = this.props.kandidatliste.kandidatlisteId;

        this.props.endreUtfallKandidat(
            utfall,
            this.props.valgtNavKontor,
            kandidatlisteId,
            kandidat.kandidatnr
        );

        sendEvent('kandidatliste', 'endre_utfall', {
            utfall,
            forrigeUtfall: kandidat.utfall,
        });
    };

    bekreftEndreUtfallModal = () => {
        if (this.state.endreUtfallModal.utfall && this.state.endreUtfallModal.kandidat) {
            this.endreUtfallForKandidat(
                this.state.endreUtfallModal.utfall,
                this.state.endreUtfallModal.kandidat
            );

            this.lukkEndreUtfallModal();
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
        const { deleModalOpen, infobanner, leggTilModalOpen, kopierEpostModalOpen } = this.state;
        const { kandidater, kandidatliste, endreStatusKandidat, toggleArkivert } = this.props;

        const {
            tittel,
            organisasjonNavn,
            opprettetAv,
            kandidatlisteId,
            stillingId,
            kanEditere,
            beskrivelse,
            formidlingerAvUsynligKandidat,
        } = kandidatliste;

        return (
            <div>
                {deleModalOpen && (
                    <PresenterKandidaterModal
                        vis={this.state.deleModalOpen}
                        onClose={this.onToggleDeleModal}
                        onSubmit={this.onDelMedArbeidsgiver}
                        antallKandidater={
                            kandidater.filter((kandidat) => kandidat.tilstand.markert).length
                        }
                    />
                )}
                {leggTilModalOpen && (
                    <LeggTilKandidatModal
                        vis={this.state.leggTilModalOpen}
                        onClose={this.onToggleLeggTilKandidatModal}
                        stillingsId={stillingId}
                        kandidatliste={kandidatliste}
                    />
                )}
                {stillingId && (
                    <>
                        <SendSmsModal
                            vis={this.state.sendSmsModalOpen}
                            onClose={() => this.onToggleSendSmsModal(false)}
                            kandidatlisteId={kandidatlisteId}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />
                        {this.state.endreUtfallModal.kandidat &&
                            this.state.endreUtfallModal.utfall && (
                                <EndreUtfallModal
                                    vis={this.state.endreUtfallModal.open}
                                    onLukk={this.lukkEndreUtfallModal}
                                    kandidat={this.state.endreUtfallModal.kandidat}
                                    utfall={this.state.endreUtfallModal.utfall}
                                    onBekreft={this.bekreftEndreUtfallModal}
                                />
                            )}
                    </>
                )}
                <KopierEpostModal
                    vis={kopierEpostModalOpen}
                    onClose={this.onToggleKopierEpostModal}
                    kandidater={kandidater.filter((kandidat) => kandidat.tilstand.markert)}
                />
                <HjelpetekstFading
                    synlig={infobanner.vis}
                    type={infobanner.type || 'suksess'}
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
                    formidlingerAvUsynligKandidat={formidlingerAvUsynligKandidat}
                    filter={this.props.filter}
                    toggleMarkert={this.toggleMarkert}
                    fjernAllMarkering={this.fjernAllMarkering}
                    markerKandidater={this.markerKandidater}
                    onKandidatStatusChange={endreStatusKandidat}
                    onKandidatUtfallChange={this.onKandidatUtfallChange}
                    onKandidatShare={this.onToggleDeleModal}
                    onEmailKandidater={this.onEmailKandidater}
                    onKandidaterAngreArkivering={this.onKandidaterAngreArkivering}
                    onSendSmsClick={() => this.onToggleSendSmsModal(true)}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                    onVisningChange={this.onVisningChange}
                    beskrivelse={beskrivelse}
                    toggleArkivert={toggleArkivert}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    filter: state.kandidatliste.filter,
    deleStatus: state.kandidatliste.deleStatus,
    smsSendStatus: state.kandidatliste.sms.sendStatus,
    leggTilStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatliste.fodselsnummer,
    kandidat: state.kandidatliste.kandidat,
    statusArkivering: state.kandidatliste.arkivering.statusArkivering,
    statusDearkivering: state.kandidatliste.arkivering.statusDearkivering,
    midlertidigUtilgjengeligEndretTidspunkt: state.midlertidigUtilgjengelig.endretTidspunkt,
    valgtNavKontor: state.navKontor.valgtNavKontor,
    formidlingAvUsynligKandidat: state.kandidatliste.formidlingAvUsynligKandidat,
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
    hentNotater: (kandidatlisteId: string, kandidatnr: string) => {
        dispatch({ type: KandidatlisteActionType.HENT_NOTATER, kandidatlisteId, kandidatnr });
    },
    toggleArkivert: (kandidatlisteId: string, kandidatnr: string, arkivert: boolean) => {
        dispatch({
            type: KandidatlisteActionType.TOGGLE_ARKIVERT,
            kandidatlisteId,
            kandidatnr,
            arkivert,
        });
    },
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => {
        dispatch({
            type: KandidatlisteActionType.ANGRE_ARKIVERING,
            kandidatlisteId,
            kandidatnumre,
        });
    },
    toggleMarkeringAvKandidat: (kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.TOGGLE_MARKERING_AV_KANDIDAT,
            kandidatnr,
        });
    },
    endreMarkeringAvKandidater: (kandidatnumre: string[]) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_MARKERING_AV_KANDIDATER,
            kandidatnumre,
        });
    },
    endreVisningsstatusKandidat: (kandidatnr: string, visningsstatus: Visningsstatus) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_VISNINGSSTATUS_KANDIDAT,
            kandidatnr,
            visningsstatus,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteOgModaler);
