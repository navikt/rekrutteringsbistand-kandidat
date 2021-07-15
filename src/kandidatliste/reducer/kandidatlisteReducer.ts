import { FormidlingAvUsynligKandidatOutboundDto } from '../modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { CvSøkeresultat } from '../../kandidatside/cv/reducer/cv-typer';
import {
    filtrerKandidater,
    lagTomtStatusfilter,
    lagTomtUtfallsfilter,
} from '../filter/filter-utils';
import { Kandidatlistefilter, Navn } from '../kandidatlistetyper';
import { Visningsstatus } from '../Kandidatliste';
import {
    Kandidat,
    Sms,
    SmsStatus,
    Kandidattilstander,
    Kandidatnotater,
    Kandidattilstand,
} from '../kandidatlistetyper';
import KandidatlisteActionType from './KandidatlisteActionType';
import { Reducer } from 'redux';
import {
    Nettressurs,
    finnesIkke,
    ikkeLastet,
    feil,
    lasterInn,
    Nettstatus,
    RemoteData,
    senderInn,
    suksess,
} from '../../api/remoteData';
import KandidatlisteAction from './KandidatlisteAction';
import { Kandidatliste } from '../kandidatlistetyper';
import { SearchApiError } from '../../api/fetchUtils';
import { ForespørselOmDelingAvCv } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

type FormidlingId = string;

export interface KandidatlisteState {
    hentStatus: Nettstatus;
    kandidat?: CvSøkeresultat;

    lagreStatus: Nettstatus;
    deleStatus: Nettstatus;
    opprett: {
        lagreStatus: Nettstatus;
        opprettetKandidatlisteTittel?: string;
    };

    id?: string;
    kandidatliste: RemoteData<Kandidatliste>;
    kandidattilstander: Kandidattilstander;
    kandidatnotater: Kandidatnotater;
    sms: {
        sendStatus: SmsStatus;
        sendteMeldinger: RemoteData<Sms[]>;
        error?: SearchApiError;
    };
    forespørslerOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv[]>;
    fodselsnummer?: string;
    leggTilKandidater: {
        lagreStatus: string;
        antallLagredeKandidater: number;
        lagretListe?: {
            kandidatlisteId: string;
            tittel: string;
        };
    };
    hentListeMedAnnonsenummerStatus: Nettstatus;
    hentListeMedAnnonsenummerStatusMessage?: string;
    kandidatlisteMedAnnonsenummer?: any;
    lagreKandidatIKandidatlisteStatus: string;
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
    filter: Kandidatlistefilter;
    notat?: string;
    søkPåusynligKandidat: Nettressurs<Navn[]>;
    formidlingAvUsynligKandidat: Nettressurs<FormidlingAvUsynligKandidatOutboundDto>;
    endreFormidlingsutfallForUsynligKandidat: Record<FormidlingId, Nettressurs<FormidlingId>>;
    endreKandidatlistestatus: Nettstatus;
}

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
    hentStatus: Nettstatus.IkkeLastet,
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
    forespørslerOmDelingAvCv: ikkeLastet(),
    arkivering: {
        statusArkivering: Nettstatus.IkkeLastet,
        statusDearkivering: Nettstatus.IkkeLastet,
    },
    scrollPosition: {},
    filter: {
        visArkiverte: false,
        status: lagTomtStatusfilter(),
        utfall: lagTomtUtfallsfilter(),
        navn: '',
    },
    søkPåusynligKandidat: ikkeLastet(),
    formidlingAvUsynligKandidat: ikkeLastet(),
    endreFormidlingsutfallForUsynligKandidat: {},
    endreKandidatlistestatus: Nettstatus.IkkeLastet,
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
                    [action.formidlingId]: senderInn(action.formidlingId),
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
                deleStatus: Nettstatus.IkkeLastet,
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
        case KandidatlisteActionType.HentKandidatMedFnr: {
            return {
                ...state,
                hentStatus: Nettstatus.LasterInn,
            };
        }
        case KandidatlisteActionType.HentKandidatMedFnrSuccess: {
            return {
                ...state,
                hentStatus: Nettstatus.Suksess,
                kandidat: action.kandidat,
            };
        }
        case KandidatlisteActionType.HentKandidatMedFnrNotFound: {
            return {
                ...state,
                hentStatus: Nettstatus.FinnesIkke,
            };
        }
        case KandidatlisteActionType.HentKandidatMedFnrFailure: {
            return {
                ...state,
                hentStatus: Nettstatus.Feil,
            };
        }
        case KandidatlisteActionType.LeggTilKandidatSøkReset: {
            return {
                ...state,
                hentStatus: Nettstatus.IkkeLastet,
                kandidat: initialState.kandidat,
                søkPåusynligKandidat: ikkeLastet(),
                formidlingAvUsynligKandidat: ikkeLastet(),
            };
        }
        case KandidatlisteActionType.HentUsynligKandidat: {
            return {
                ...state,
                søkPåusynligKandidat: lasterInn(),
            };
        }
        case KandidatlisteActionType.HentUsynligKandidatSuccess: {
            return {
                ...state,
                søkPåusynligKandidat: suksess(action.navn),
            };
        }
        case KandidatlisteActionType.HentUsynligKandidatFailure: {
            return {
                ...state,
                søkPåusynligKandidat:
                    action.error.status === 404 ? finnesIkke() : feil(action.error),
            };
        }
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
        case KandidatlisteActionType.FormidleUsynligKandidat: {
            return {
                ...state,
                formidlingAvUsynligKandidat: senderInn(action.formidling),
            };
        }
        case KandidatlisteActionType.FormidleUsynligKandidatSuccess: {
            return {
                ...state,
                formidlingAvUsynligKandidat: suksess(action.formidling),
                kandidatliste: suksess(action.kandidatliste),
            };
        }
        case KandidatlisteActionType.FormidleUsynligKandidatFailure: {
            return {
                ...state,
                formidlingAvUsynligKandidat: feil(action.error),
            };
        }
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
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: suksess<Sms[]>(action.sendteMeldinger),
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
        case KandidatlisteActionType.HentForespørslerOmDelingAvCv:
            return {
                ...state,
                forespørslerOmDelingAvCv: lasterInn(),
            };
        case KandidatlisteActionType.HentForespørslerOmDelingAvCvSuccess:
            return {
                ...state,
                forespørslerOmDelingAvCv: suksess<ForespørselOmDelingAvCv[]>(
                    action.forespørslerOmDelingAvCv
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
                    action.filter
                );

                Object.keys(kandidattilstander).forEach((kandidatnr) => {
                    if (filtrerteKandidater.includes(kandidatnr)) {
                        kandidattilstander[kandidatnr].filtrertBort = false;
                    } else {
                        kandidattilstander[kandidatnr].filtrertBort = true;

                        // Kan fjernes hvis man ønsker at kandidater fremdeles skal
                        // være markerte etter de er filtrert bort.
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
                        markert: !state.kandidattilstander[action.kandidatnr].markert,
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

        default:
            return state;
    }
};

export default reducer;
