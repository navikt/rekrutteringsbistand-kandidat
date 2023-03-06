import { CvSøkeresultat } from '../../cv/reducer/cv-typer';
import {
    filtrerKandidater,
    lagTomtStatusfilter,
    lagTomtHendelsefilter,
} from '../filter/filter-utils';
import { Kandidat, Kandidatstatus, UsynligKandidat } from '../domene/Kandidat';
import KandidatlisteActionType from './KandidatlisteActionType';
import { Reducer } from 'redux';
import {
    Nettressurs,
    ikkeLastet,
    feil,
    lasterInn,
    Nettstatus,
    senderInn,
    suksess,
} from '../../api/Nettressurs';
import KandidatlisteAction from './KandidatlisteAction';
import { SearchApiError } from '../../api/fetchUtils';
import { Kandidatliste } from '../domene/Kandidatliste';
import {
    Kandidattilstander,
    Kandidatnotater,
    Kandidattilstand,
    Visningsstatus,
} from '../domene/Kandidatressurser';
import { SmsStatus, Kandidatmeldinger } from '../domene/Kandidatressurser';
import { KandidatSorteringsfelt } from '../kandidatsortering';
import { Retning } from '../../common/sorterbarKolonneheader/Retning';
import {
    ForespørslerGruppertPåAktørId,
    separerGjeldendeForespørselFraRespons,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Hendelse } from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';

type FormidlingId = string;

export type Kandidatsortering = null | {
    felt: KandidatSorteringsfelt;
    retning: Retning | null;
};

export type KandidatlisteState = {
    kandidat?: CvSøkeresultat;

    lagreStatus: Nettstatus;
    deleStatus: Nettstatus;
    opprett: {
        lagreStatus: Nettstatus;
        opprettetKandidatlisteTittel?: string;
    };
    id?: string;
    kandidatliste: Nettressurs<Kandidatliste>;
    kandidattilstander: Kandidattilstander;
    kandidatnotater: Kandidatnotater;
    sms: {
        sendStatus: SmsStatus;
        sendteMeldinger: Nettressurs<Kandidatmeldinger>;
        error?: SearchApiError;
    };
    sendForespørselOmDelingAvCv: Nettressurs<ForespørslerGruppertPåAktørId>;
    forespørslerOmDelingAvCv: Nettressurs<ForespørslerGruppertPåAktørId>;
    fodselsnummer?: string;
    leggTilKandidater: {
        lagreStatus: Nettstatus;
        antallLagredeKandidater: number;
        lagretListe?: {
            kandidatlisteId: string;
            tittel: string;
        };
    };
    hentListeMedAnnonsenummerStatus: Nettstatus;
    hentListeMedAnnonsenummerStatusMessage?: string;
    kandidatlisteMedAnnonsenummer?: any;
    lagreKandidatIKandidatlisteStatus: Nettstatus;
    arkivering: {
        statusArkivering: Nettstatus;
        statusDearkivering: Nettstatus;
    };
    scrollPosition: {
        [kandidatlisteId: string]: number;
    };
    sistValgteKandidat?: {
        kandidatlisteId: string;
        kandidatnr: string;
    };
    sortering: Kandidatsortering;
    filter: Kandidatlistefilter;
    notat?: string;
    søkPåusynligKandidat: Nettressurs<UsynligKandidat[]>;
    endreFormidlingsutfallForUsynligKandidat: Record<FormidlingId, Nettressurs<FormidlingId>>;
    endreKandidatlistestatus: Nettstatus;
    slettCvFraArbeidsgiversKandidatlisteStatus: Nettstatus;
};

export type Kandidatlistefilter = {
    visArkiverte: boolean;
    status: Record<Kandidatstatus, boolean>;
    hendelse: Record<Hendelse, boolean>;
    navn: string;
};

const initialState: KandidatlisteState = {
    lagreStatus: Nettstatus.IkkeLastet,
    deleStatus: Nettstatus.IkkeLastet,
    opprett: {
        lagreStatus: Nettstatus.IkkeLastet,
    },
    kandidatliste: ikkeLastet(),
    kandidattilstander: {},
    kandidatnotater: {},
    fodselsnummer: undefined,
    leggTilKandidater: {
        lagreStatus: Nettstatus.IkkeLastet,
        antallLagredeKandidater: 0,
    },
    hentListeMedAnnonsenummerStatus: Nettstatus.IkkeLastet,
    hentListeMedAnnonsenummerStatusMessage: '',
    kandidatlisteMedAnnonsenummer: undefined,
    lagreKandidatIKandidatlisteStatus: Nettstatus.IkkeLastet,
    sms: {
        sendStatus: SmsStatus.IkkeSendt,
        sendteMeldinger: ikkeLastet(),
    },
    sendForespørselOmDelingAvCv: ikkeLastet(),
    forespørslerOmDelingAvCv: ikkeLastet(),
    arkivering: {
        statusArkivering: Nettstatus.IkkeLastet,
        statusDearkivering: Nettstatus.IkkeLastet,
    },
    scrollPosition: {},
    filter: {
        visArkiverte: false,
        status: lagTomtStatusfilter(),
        hendelse: lagTomtHendelsefilter(),
        navn: '',
    },
    sortering: null,
    søkPåusynligKandidat: ikkeLastet(),
    endreFormidlingsutfallForUsynligKandidat: {},
    endreKandidatlistestatus: Nettstatus.IkkeLastet,
    slettCvFraArbeidsgiversKandidatlisteStatus: Nettstatus.IkkeLastet,
};

const reducer: Reducer<KandidatlisteState, KandidatlisteAction> = (
    state = initialState,
    action
): KandidatlisteState => {
    switch (action.type) {
        case KandidatlisteActionType.OpprettKandidatliste:
        case KandidatlisteActionType.OppdaterKandidatliste:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: Nettstatus.SenderInn,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteActionType.OpprettKandidatlisteSuccess:
        case KandidatlisteActionType.OppdaterKandidatlisteSuccess:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: Nettstatus.Suksess,
                    opprettetKandidatlisteTittel: action.tittel,
                },
            };
        case KandidatlisteActionType.OpprettKandidatlisteFailure:
        case KandidatlisteActionType.OppdaterKandidatlisteFailure:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: Nettstatus.Feil,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteActionType.ResetLagreStatus:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: Nettstatus.IkkeLastet,
                },
            };
        case KandidatlisteActionType.HentKandidatlisteMedStillingsId:
        case KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId: {
            return {
                ...state,
                kandidatliste: lasterInn(),
            };
        }
        case KandidatlisteActionType.HentKandidatlisteMedStillingsIdSuccess:
        case KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdSuccess: {
            const id = action.kandidatliste.kandidatlisteId;
            const erNyListe = id !== state.id;

            const eksisterendeKandidattilstander = Object.keys(state.kandidattilstander);
            const noenKandidaterManglerTilstand = action.kandidatliste.kandidater.some(
                ({ kandidatnr }) => !eksisterendeKandidattilstander.includes(kandidatnr)
            );

            let kandidattilstander = state.kandidattilstander;
            let kandidatnotater = state.kandidatnotater;

            // Reset kandidattilstander hvis bruker laster inn ny liste eller
            // en kandidat er lagt til i listen siden sist.
            if (erNyListe || noenKandidaterManglerTilstand) {
                kandidattilstander = {};
                kandidatnotater = {};

                action.kandidatliste.kandidater.forEach((kandidat) => {
                    kandidattilstander[kandidat.kandidatnr] = initialKandidattilstand();
                    kandidatnotater[kandidat.kandidatnr] = ikkeLastet();
                });
            }

            return {
                ...state,
                id,
                kandidatliste: suksess(action.kandidatliste),
                kandidattilstander,
                kandidatnotater,
            };
        }
        case KandidatlisteActionType.HentKandidatlisteMedStillingsIdFailure:
        case KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdFailure:
            return {
                ...state,
                kandidatliste: feil(action.error),
            };
        case KandidatlisteActionType.NullstillKandidatliste: {
            return {
                ...state,
                kandidatliste: ikkeLastet(),
            };
        }
        case KandidatlisteActionType.EndreStatusKandidatSuccess:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
            };
        case KandidatlisteActionType.EndreUtfallKandidatSuccess:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
            };
        case KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidat:
            return {
                ...state,
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: senderInn(),
                },
            };
        case KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatSuccess:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: suksess(action.formidlingId),
                },
            };
        case KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatFailure:
            return {
                ...state,
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: feil(action.error),
                },
            };
        case KandidatlisteActionType.PresenterKandidater:
            return {
                ...state,
                deleStatus: Nettstatus.LasterInn,
            };
        case KandidatlisteActionType.PresenterKandidaterSuccess:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
                deleStatus: Nettstatus.Suksess,
            };
        case KandidatlisteActionType.PresenterKandidaterFailure:
            return {
                ...state,
                deleStatus: Nettstatus.Feil,
            };

        case KandidatlisteActionType.ResetDelestatus:
            return {
                ...state,
                deleStatus: Nettstatus.IkkeLastet,
            };
        case KandidatlisteActionType.SetFodselsnummer: {
            return {
                ...state,
                fodselsnummer: action.fodselsnummer,
            };
        }
        case KandidatlisteActionType.SetNotat:
            return {
                ...state,
                notat: action.notat,
            };
        case KandidatlisteActionType.LeggTilKandidater:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: Nettstatus.SenderInn,
                },
            };
        case KandidatlisteActionType.LeggTilKandidaterSuccess: {
            const kandidatnotater = {
                ...state.kandidatnotater,
            };

            const kandidattilstander = {
                ...state.kandidattilstander,
            };

            action.lagredeKandidater.forEach((lagretKandidat) => {
                kandidattilstander[lagretKandidat.kandidatnr] = initialKandidattilstand();
                kandidatnotater[lagretKandidat.kandidatnr] = ikkeLastet();
            });

            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: Nettstatus.Suksess,
                    antallLagredeKandidater: action.antallLagredeKandidater,
                    lagretListe: action.lagretListe,
                },
                kandidatliste: suksess(action.kandidatliste),
                kandidattilstander,
                kandidatnotater,
            };
        }
        case KandidatlisteActionType.LeggTilKandidaterFailure:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: Nettstatus.Feil,
                },
            };

        case KandidatlisteActionType.LeggTilKandidaterReset:
            return {
                ...state,
                leggTilKandidater: {
                    lagreStatus: Nettstatus.IkkeLastet,
                    antallLagredeKandidater: 0,
                },
            };
        case KandidatlisteActionType.LagreKandidatIKandidatliste:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: Nettstatus.SenderInn,
            };
        case KandidatlisteActionType.LagreKandidatIKandidatlisteSuccess:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: Nettstatus.Suksess,
            };
        case KandidatlisteActionType.LagreKandidatIKandidatlisteFailure:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: Nettstatus.Feil,
            };
        case KandidatlisteActionType.HentNotater:
            return {
                ...state,
                kandidatnotater: {
                    ...state.kandidatnotater,
                    [action.kandidatnr]: lasterInn(),
                },
            };
        case KandidatlisteActionType.HentNotaterSuccess:
        case KandidatlisteActionType.OpprettNotatSuccess:
        case KandidatlisteActionType.EndreNotatSuccess:
        case KandidatlisteActionType.SlettNotatSuccess:
            return {
                ...state,
                kandidatnotater: {
                    ...state.kandidatnotater,
                    [action.kandidatnr]: suksess(action.notater),
                },
            };
        case KandidatlisteActionType.ToggleArkivert:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.LasterInn,
                },
            };
        case KandidatlisteActionType.ToggleArkivertSuccess:
            return {
                ...oppdaterArkivertIKandidatlisteDetaljer(state, action.kandidat),
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.Suksess,
                },
            };
        case KandidatlisteActionType.ToggleArkivertFailure:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.Feil,
                },
            };
        case KandidatlisteActionType.AngreArkivering:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.LasterInn,
                },
            };
        case KandidatlisteActionType.AngreArkiveringFailure:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.Feil,
                },
            };
        case KandidatlisteActionType.AngreArkiveringSuccess:
            return {
                ...oppdaterDearkiverteKandidaterIKandidatlisteDetaljer(state, action.kandidatnumre),
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.Suksess,
                },
            };
        case KandidatlisteActionType.HentKandidatlisteMedAnnonsenummer:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: Nettstatus.LasterInn,
            };
        case KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerSuccess:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: Nettstatus.Suksess,
                kandidatlisteMedAnnonsenummer: {
                    ...action.kandidatliste,
                    markert: true,
                },
            };
        case KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerNotFound:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: Nettstatus.FinnesIkke,
                hentListeMedAnnonsenummerStatusMessage: action.message,
            };
        case KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerFailure:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: Nettstatus.Feil,
            };
        case KandidatlisteActionType.SendSms:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.UnderUtsending,
                },
            };
        case KandidatlisteActionType.SendSmsSuccess:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.Sendt,
                },
            };
        case KandidatlisteActionType.SendSmsFailure:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.Feil,
                    error: action.error,
                },
            };
        case KandidatlisteActionType.ResetSendSmsStatus:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.IkkeSendt,
                },
            };
        case KandidatlisteActionType.HentSendteMeldinger:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: lasterInn(),
                },
            };
        case KandidatlisteActionType.HentSendteMeldingerSuccess:
            const kandidatmeldinger: Kandidatmeldinger = {};

            action.sendteMeldinger.forEach((sendtMelding) => {
                kandidatmeldinger[sendtMelding.fnr] = sendtMelding;
            });

            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: {
                        kind: Nettstatus.Suksess,
                        data: kandidatmeldinger,
                    },
                },
            };
        case KandidatlisteActionType.HentSendteMeldingerFailure:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: feil(action.error),
                },
            };
        case KandidatlisteActionType.SendForespørselOmDelingAvCv:
            return {
                ...state,
                sendForespørselOmDelingAvCv: senderInn(),
            };
        case KandidatlisteActionType.SendForespørselOmDelingAvCvSuccess: {
            return {
                ...state,
                sendForespørselOmDelingAvCv: suksess(
                    separerGjeldendeForespørselFraRespons(action.forespørslerOmDelingAvCv)
                ),
                forespørslerOmDelingAvCv: suksess(
                    separerGjeldendeForespørselFraRespons(action.forespørslerOmDelingAvCv)
                ),
            };
        }
        case KandidatlisteActionType.SendForespørselOmDelingAvCvFailure: {
            return {
                ...state,
                sendForespørselOmDelingAvCv: feil(action.error),
            };
        }
        case KandidatlisteActionType.ResetSendForespørselOmDelingAvCv: {
            return {
                ...state,
                sendForespørselOmDelingAvCv: ikkeLastet(),
            };
        }
        case KandidatlisteActionType.NullstillForespørslerOmDelingAvCv:
            return {
                ...state,
                forespørslerOmDelingAvCv: ikkeLastet(),
            };
        case KandidatlisteActionType.HentForespørslerOmDelingAvCv:
            return {
                ...state,
                forespørslerOmDelingAvCv: lasterInn(),
            };
        case KandidatlisteActionType.HentForespørslerOmDelingAvCvSuccess:
            return {
                ...state,
                forespørslerOmDelingAvCv: suksess(
                    separerGjeldendeForespørselFraRespons(action.forespørslerOmDelingAvCv)
                ),
            };
        case KandidatlisteActionType.ResendForespørselOmDelingAvCvSuccess:
            return {
                ...state,
                forespørslerOmDelingAvCv: suksess(
                    separerGjeldendeForespørselFraRespons(action.forespørslerOmDelingAvCv)
                ),
            };
        case KandidatlisteActionType.HentForespørslerOmDelingAvCvFailure:
            return {
                ...state,
                forespørslerOmDelingAvCv: feil(action.error),
            };
        case KandidatlisteActionType.VelgKandidat: {
            const { kandidatlisteId, kandidatnr } = action;
            const sistValgteKandidat =
                kandidatlisteId && kandidatnr
                    ? {
                          kandidatlisteId,
                          kandidatnr,
                      }
                    : undefined;
            return {
                ...state,
                sistValgteKandidat: sistValgteKandidat,
            };
        }
        case KandidatlisteActionType.EndreKandidatlisteFilter: {
            const kandidattilstander = {
                ...state.kandidattilstander,
            };

            if (state.kandidatliste.kind === Nettstatus.Suksess) {
                const filtrerteKandidater = filtrerKandidater(
                    state.kandidatliste.data.kandidater,
                    state.forespørslerOmDelingAvCv,
                    action.filter
                );

                Object.keys(kandidattilstander).forEach((kandidatnr) => {
                    if (filtrerteKandidater.includes(kandidatnr)) {
                        kandidattilstander[kandidatnr].filtrertBort = false;
                    } else {
                        kandidattilstander[kandidatnr].filtrertBort = true;
                        kandidattilstander[kandidatnr].markert = false;
                    }
                });
            }

            return {
                ...state,
                filter: action.filter,
                kandidattilstander,
            };
        }

        case KandidatlisteActionType.ToggleMarkeringAvKandidat:
            return {
                ...state,
                kandidattilstander: {
                    ...state.kandidattilstander,
                    [action.kandidatnr]: {
                        ...state.kandidattilstander[action.kandidatnr],
                        markert: !state.kandidattilstander[action.kandidatnr]?.markert,
                    },
                },
            };

        case KandidatlisteActionType.EndreMarkeringAvKandidater:
            return {
                ...state,
                kandidattilstander: markerGitteKandidater(
                    state.kandidattilstander,
                    action.kandidatnumre
                ),
            };

        case KandidatlisteActionType.EndreVisningsstatusKandidat:
            return {
                ...state,
                kandidattilstander: {
                    ...state.kandidattilstander,
                    [action.kandidatnr]: {
                        ...state.kandidattilstander[action.kandidatnr],
                        visningsstatus: action.visningsstatus,
                    },
                },
            };

        case KandidatlisteActionType.EndreKandidatlistestatus:
            return {
                ...state,
                endreKandidatlistestatus: Nettstatus.SenderInn,
            };

        case KandidatlisteActionType.EndreKandidatlistestatusSuccess:
            return {
                ...state,
                endreKandidatlistestatus: Nettstatus.Suksess,
                kandidatliste: suksess(action.kandidatliste),
            };

        case KandidatlisteActionType.EndreSortering:
            return {
                ...state,
                sortering: action.sortering,
            };

        case KandidatlisteActionType.FormidleUsynligKandidatSuccess: {
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
            };
        }

        case KandidatlisteActionType.SlettCvFraArbeidsgiversKandidatliste: {
            return {
                ...state,
                slettCvFraArbeidsgiversKandidatlisteStatus: Nettstatus.SenderInn,
            };
        }

        case KandidatlisteActionType.SlettCvFraArbeidsgiversKandidatlisteSuccess: {
            return {
                ...state,
                slettCvFraArbeidsgiversKandidatlisteStatus: Nettstatus.Suksess,
                kandidatliste: suksess(action.kandidatliste),
            };
        }

        case KandidatlisteActionType.SlettCvFraArbeidsgiversKandidatlisteFailure: {
            return {
                ...state,
                slettCvFraArbeidsgiversKandidatlisteStatus: Nettstatus.Feil,
            };
        }

        default:
            return state;
    }
};

const initialKandidattilstand = (): Kandidattilstand => ({
    markert: false,
    filtrertBort: false,
    visningsstatus: Visningsstatus.SkjulPanel,
});

const oppdaterArkivertIKandidatlisteDetaljer = (
    state: KandidatlisteState,
    kandidat: Kandidat
): KandidatlisteState => {
    const kandidatliste = state.kandidatliste;
    if (kandidatliste.kind === Nettstatus.Suksess) {
        const stateMedOppdatertKandidat = {
            ...state,
            kandidatliste: {
                ...kandidatliste,
                data: {
                    ...kandidatliste.data,
                    kandidater: kandidatliste.data.kandidater.map((utdatertKandidat) =>
                        utdatertKandidat.kandidatnr === kandidat.kandidatnr
                            ? {
                                  ...utdatertKandidat,
                                  arkivert: kandidat.arkivert,
                                  arkivertAv: kandidat.arkivertAv,
                                  arkivertTidspunkt: kandidat.arkivertTidspunkt,
                              }
                            : utdatertKandidat
                    ),
                },
            },
        };

        return stateMedOppdatertKandidat;
    }

    return state;
};

const oppdaterDearkiverteKandidaterIKandidatlisteDetaljer = (
    state: KandidatlisteState,
    kandidatnumre: string[]
): KandidatlisteState => {
    const kandidatliste = state.kandidatliste;
    if (kandidatliste.kind === Nettstatus.Suksess) {
        return {
            ...state,
            kandidatliste: {
                ...kandidatliste,
                data: {
                    ...kandidatliste.data,
                    kandidater: kandidatliste.data.kandidater.map((utdatertKandidat) =>
                        kandidatnumre.includes(utdatertKandidat.kandidatnr)
                            ? {
                                  ...utdatertKandidat,
                                  arkivert: false,
                                  arkivertTidspunkt: null,
                              }
                            : utdatertKandidat
                    ),
                },
            },
        };
    }
    return state;
};

const markerGitteKandidater = (kandidattilstander: Kandidattilstander, kandidatnumre: string[]) => {
    const nyeTilstander = {
        ...kandidattilstander,
    };

    Object.entries(nyeTilstander).forEach(([kandidatnr, tilstand]) => {
        nyeTilstander[kandidatnr] = {
            ...tilstand,
            markert: kandidatnumre.includes(kandidatnr),
        };
    });

    return nyeTilstander;
};

export default reducer;
