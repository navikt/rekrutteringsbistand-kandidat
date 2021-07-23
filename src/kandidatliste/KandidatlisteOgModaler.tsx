import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Kandidatliste as Kandidatlistetype } from './domene/Kandidatliste';
import { Kandidatstatus } from './domene/Kandidat';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import { sendEvent } from '../amplitude/amplitude';
import AppState from '../AppState';
import HjelpetekstFading from '../common/varsling/HjelpetekstFading';
import KandidatlisteAction from './reducer/KandidatlisteAction';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import KopierEpostModal from './modaler/KopierEpostModal';
import PresenterKandidaterModal from './modaler/presenter-kandidater/PresenterKandidaterModal';
import SendSmsModal from './modaler/SendSmsModal';
import { CvSøkeresultat } from '../kandidatside/cv/reducer/cv-typer';
import LeggTilKandidatModal, {
    FormidlingAvUsynligKandidatOutboundDto,
} from './modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { SmsStatus, Kandidattilstander, Kandidatmeldinger } from './domene/Kandidatressurser';
import './Kandidatliste.less';
import Kandidatliste from './Kandidatliste';

type OwnProps = {
    kandidatliste: Kandidatlistetype;
};

type ConnectedProps = {
    endreStatusKandidat: any;
    presenterKandidater: (
        beskjed: string,
        mailadresser: Array<string>,
        kandidatlisteId: string,
        kandidatnummerListe: Array<string>,
        navKontor: string
    ) => void;
    resetDeleStatus: () => void;
    deleStatus: Nettstatus;
    smsSendStatus: SmsStatus;
    resetSmsSendStatus: () => void;
    leggTilStatus: Nettstatus;
    fodselsnummer?: string;
    kandidat?: CvSøkeresultat;
    toggleArkivert: (kandidatlisteId: string, kandidatnr: string, arkivert: boolean) => void;
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => void;
    statusArkivering: Nettstatus;
    statusDearkivering: Nettstatus;
    valgtNavKontor: string | null;
    toggleMarkeringAvKandidat: (kandidatnr: string) => void;
    endreMarkeringAvKandidater: (kandidatnumre: string[]) => void;
    formidlingAvUsynligKandidat: Nettressurs<FormidlingAvUsynligKandidatOutboundDto>;
    kandidattilstander: Kandidattilstander;
    sendteMeldinger: Nettressurs<Kandidatmeldinger>;
};

type Props = ConnectedProps & OwnProps;

class KandidatlisteOgModaler extends React.Component<Props> {
    infobannerCallbackId: any;

    state: {
        deleModalOpen: boolean;
        leggTilModalOpen: boolean;
        kopierEpostModalOpen: boolean;
        sendSmsModalOpen: boolean;
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
            infobanner: {
                vis: false,
                tekst: '',
                type: 'suksess',
            },
        };
    }

    componentDidUpdate(prevProps: Props) {
        const kandidaterHarNettoppBlittPresentert =
            this.props.deleStatus !== prevProps.deleStatus &&
            this.props.deleStatus === Nettstatus.Suksess;

        const smsErNettoppSendtTilKandidater =
            this.props.smsSendStatus !== prevProps.smsSendStatus &&
            this.props.smsSendStatus === SmsStatus.Sendt;

        const kandidaterHarNettoppBlittLagtTil =
            this.props.leggTilStatus !== prevProps.leggTilStatus &&
            this.props.leggTilStatus === Nettstatus.Suksess;

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

            const antallMarkerteKandidater = Object.values(this.props.kandidattilstander).filter(
                (tilstand) => tilstand?.markert
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
                    `Kandidaten (${this.props.formidlingAvUsynligKandidat.data.fnr}) er blitt formidlet`
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

    hentMarkerteKandidater = () => {
        const { kandidatliste, kandidattilstander } = this.props;

        return kandidatliste.kandidater.filter(
            (kandidat) => kandidattilstander[kandidat.kandidatnr]?.markert
        );
    };

    hentKandidatnumrePåMarkerteKandidater = () => {
        return this.hentMarkerteKandidater().map((kandidat) => kandidat.kandidatnr);
    };

    onDelMedArbeidsgiver = (beskjed: string, mailadresser: string[]) => {
        if (this.props.valgtNavKontor === null) {
            return; // TODO: Ikke la PresenterKandidaterModal submitte hvis ikke Nav-kontor er valgt
        }

        const markerteKandidater = this.hentKandidatnumrePåMarkerteKandidater();

        sendEvent('kandidatliste', 'presenter_kandidater', {
            antallKandidater: markerteKandidater.length,
        });

        this.props.presenterKandidater(
            beskjed,
            mailadresser,
            this.props.kandidatliste.kandidatlisteId,
            markerteKandidater,
            this.props.valgtNavKontor
        );
        this.setState({
            deleModalOpen: false,
        });
    };

    onKandidaterAngreArkivering = () => {
        const markerteKandidater = this.hentKandidatnumrePåMarkerteKandidater();

        this.props.angreArkiveringForKandidater(
            this.props.kandidatliste.kandidatlisteId,
            markerteKandidater
        );
    };

    onEmailKandidater = () => {
        this.setState({
            kopierEpostModalOpen: true,
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
        const { kandidatliste, endreStatusKandidat, toggleArkivert } = this.props;
        const { kandidater } = kandidatliste;
        const markerteKandidater = this.hentMarkerteKandidater();

        return (
            <div>
                {deleModalOpen && (
                    <PresenterKandidaterModal
                        vis={this.state.deleModalOpen}
                        onClose={this.onToggleDeleModal}
                        onSubmit={this.onDelMedArbeidsgiver}
                        antallKandidater={markerteKandidater.length}
                    />
                )}
                {leggTilModalOpen && (
                    <LeggTilKandidatModal
                        vis={this.state.leggTilModalOpen}
                        onClose={this.onToggleLeggTilKandidatModal}
                        stillingsId={kandidatliste.stillingId}
                        kandidatliste={kandidatliste}
                    />
                )}
                {kandidatliste.stillingId &&
                    this.props.sendteMeldinger.kind === Nettstatus.Suksess && (
                        <>
                            <SendSmsModal
                                vis={this.state.sendSmsModalOpen}
                                onClose={() => this.onToggleSendSmsModal(false)}
                                kandidatlisteId={kandidatliste.kandidatlisteId}
                                kandidater={kandidater}
                                sendteMeldinger={this.props.sendteMeldinger.data}
                                stillingId={kandidatliste.stillingId}
                            />
                        </>
                    )}
                <KopierEpostModal
                    vis={kopierEpostModalOpen}
                    onClose={this.onToggleKopierEpostModal}
                    kandidater={markerteKandidater}
                />
                <HjelpetekstFading
                    synlig={infobanner.vis}
                    type={infobanner.type || 'suksess'}
                    innhold={infobanner.tekst}
                />
                <Kandidatliste
                    kandidatliste={kandidatliste}
                    onToggleMarkert={this.toggleMarkert}
                    onFjernAllMarkering={this.fjernAllMarkering}
                    onMarkerKandidater={this.markerKandidater}
                    onKandidatStatusChange={endreStatusKandidat}
                    onKandidatShare={this.onToggleDeleModal}
                    onEmailKandidater={this.onEmailKandidater}
                    onKandidaterAngreArkivering={this.onKandidaterAngreArkivering}
                    onSendSmsClick={() => this.onToggleSendSmsModal(true)}
                    onLeggTilKandidat={this.onToggleLeggTilKandidatModal}
                    onToggleArkivert={toggleArkivert}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    deleStatus: state.kandidatliste.deleStatus,
    smsSendStatus: state.kandidatliste.sms.sendStatus,
    leggTilStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatliste.fodselsnummer,
    kandidat: state.kandidatliste.kandidat,
    sendteMeldinger: state.kandidatliste.sms.sendteMeldinger,
    statusArkivering: state.kandidatliste.arkivering.statusArkivering,
    statusDearkivering: state.kandidatliste.arkivering.statusDearkivering,
    valgtNavKontor: state.navKontor.valgtNavKontor,
    formidlingAvUsynligKandidat: state.kandidatliste.formidlingAvUsynligKandidat,
    kandidattilstander: state.kandidatliste.kandidattilstander,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatlisteAction>) => ({
    endreStatusKandidat: (status: Kandidatstatus, kandidatlisteId: string, kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.EndreStatusKandidat,
            status,
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
            type: KandidatlisteActionType.PresenterKandidater,
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe,
            navKontor,
        });
    },
    resetDeleStatus: () => {
        dispatch({ type: KandidatlisteActionType.ResetDelestatus });
    },
    resetSmsSendStatus: () => {
        dispatch({ type: KandidatlisteActionType.ResetSendSmsStatus });
    },
    toggleArkivert: (kandidatlisteId: string, kandidatnr: string, arkivert: boolean) => {
        dispatch({
            type: KandidatlisteActionType.ToggleArkivert,
            kandidatlisteId,
            kandidatnr,
            arkivert,
        });
    },
    angreArkiveringForKandidater: (kandidatlisteId: string, kandidatnumre: string[]) => {
        dispatch({
            type: KandidatlisteActionType.AngreArkivering,
            kandidatlisteId,
            kandidatnumre,
        });
    },
    toggleMarkeringAvKandidat: (kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.ToggleMarkeringAvKandidat,
            kandidatnr,
        });
    },
    endreMarkeringAvKandidater: (kandidatnumre: string[]) => {
        dispatch({
            type: KandidatlisteActionType.EndreMarkeringAvKandidater,
            kandidatnumre,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteOgModaler);
