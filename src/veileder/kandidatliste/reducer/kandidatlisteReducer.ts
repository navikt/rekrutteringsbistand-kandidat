import { FormidlingAvUsynligKandidatOutboundDto } from './../modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { Kandidatresultat } from './../../kandidatside/cv/reducer/cv-typer';
import {
    filtrerKandidater,
    lagTomtStatusfilter,
    lagTomtUtfallsfilter,
} from './../filter/filter-utils';
import { Kandidatlistefilter, Navn } from '../kandidatlistetyper';
import { Visningsstatus } from './../Kandidatliste';
import { SearchApiError } from './../../../felles/api';
import {
    Kandidat,
    Sms,
    SmsStatus,
    Kandidattilstander,
    Kandidatnotater,
    Kandidattilstand,
} from './../kandidatlistetyper';
import KandidatlisteActionType from './KandidatlisteActionType';
import { LAGRE_STATUS } from '../../../felles/konstanter';
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
} from '../../../felles/common/remoteData';
import KandidatlisteAction from './KandidatlisteAction';
import { Delestatus, HentStatus, Kandidatliste } from '../kandidatlistetyper';

type FormidlingId = string;

export interface KandidatlisteState {
    hentStatus: HentStatus;
    kandidat?: Kandidatresultat;

    lagreStatus: string;
    deleStatus: Delestatus;
    opprett: {
        lagreStatus: string;
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

    fodselsnummer?: string;
    leggTilKandidater: {
        lagreStatus: string;
        antallLagredeKandidater: number;
        lagretListe: {};
    };
    hentListeMedAnnonsenummerStatus: HentStatus;
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
    lagreStatus: LAGRE_STATUS.UNSAVED,
    deleStatus: Delestatus.IkkeSpurt,
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
    },
    kandidatliste: ikkeLastet(),
    kandidattilstander: {},
    kandidatnotater: {},
    fodselsnummer: undefined,
    hentStatus: HentStatus.IkkeHentet,
    leggTilKandidater: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        antallLagredeKandidater: 0,
        lagretListe: {},
    },
    hentListeMedAnnonsenummerStatus: HentStatus.IkkeHentet,
    hentListeMedAnnonsenummerStatusMessage: '',
    kandidatlisteMedAnnonsenummer: undefined,
    lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.UNSAVED,
    sms: {
        sendStatus: SmsStatus.IkkeSendt,
        sendteMeldinger: ikkeLastet(),
    },
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
        case KandidatlisteActionType.OPPRETT_KANDIDATLISTE:
        case KandidatlisteActionType.OPPDATER_KANDIDATLISTE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.LOADING,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteActionType.OPPRETT_KANDIDATLISTE_SUCCESS:
        case KandidatlisteActionType.OPPDATER_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    opprettetKandidatlisteTittel: action.tittel,
                },
            };
        case KandidatlisteActionType.OPPRETT_KANDIDATLISTE_FAILURE:
        case KandidatlisteActionType.OPPDATER_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteActionType.RESET_LAGRE_STATUS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.UNSAVED,
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID:
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID: {
            return {
                ...state,
                kandidatliste: lasterInn(),
            };
        }
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS:
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS: {
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
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE:
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE:
            return {
                ...state,
                kandidatliste: feil(action.error),
            };
        case KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_SUCCESS:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
            };
        case KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT_SUCCESS:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
            };
        case KandidatlisteActionType.ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT:
            return {
                ...state,
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: senderInn(action.formidlingId),
                },
            };
        case KandidatlisteActionType.ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT_SUCCESS:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: suksess(action.formidlingId),
                },
            };
        case KandidatlisteActionType.ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT_FAILURE:
            return {
                ...state,
                endreFormidlingsutfallForUsynligKandidat: {
                    ...state.endreFormidlingsutfallForUsynligKandidat,
                    [action.formidlingId]: feil(action.error),
                },
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER:
            return {
                ...state,
                deleStatus: Delestatus.Loading,
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER_SUCCESS:
            return {
                ...state,
                kandidatliste: suksess(action.kandidatliste),
                deleStatus: Delestatus.Success,
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE:
            return {
                ...state,
                deleStatus: Delestatus.IkkeSpurt,
            };

        case KandidatlisteActionType.RESET_DELESTATUS:
            return {
                ...state,
                deleStatus: Delestatus.IkkeSpurt,
            };
        case KandidatlisteActionType.SET_FODSELSNUMMER: {
            return {
                ...state,
                fodselsnummer: action.fodselsnummer,
            };
        }
        case KandidatlisteActionType.SET_NOTAT:
            return {
                ...state,
                notat: action.notat,
            };
        case KandidatlisteActionType.HENT_KANDIDAT_MED_FNR: {
            return {
                ...state,
                hentStatus: HentStatus.Loading,
            };
        }
        case KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_SUCCESS: {
            return {
                ...state,
                hentStatus: HentStatus.Success,
                kandidat: action.kandidat,
            };
        }
        case KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_NOT_FOUND: {
            return {
                ...state,
                hentStatus: HentStatus.FinnesIkke,
            };
        }
        case KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_FAILURE: {
            return {
                ...state,
                hentStatus: HentStatus.Failure,
            };
        }
        case KandidatlisteActionType.LEGG_TIL_KANDIDAT_SØK_RESET: {
            return {
                ...state,
                hentStatus: HentStatus.IkkeHentet,
                kandidat: initialState.kandidat,
                søkPåusynligKandidat: ikkeLastet(),
                formidlingAvUsynligKandidat: ikkeLastet(),
            };
        }
        case KandidatlisteActionType.HENT_USYNLIG_KANDIDAT: {
            return {
                ...state,
                søkPåusynligKandidat: lasterInn(),
            };
        }
        case KandidatlisteActionType.HENT_USYNLIG_KANDIDAT_SUCCESS: {
            return {
                ...state,
                søkPåusynligKandidat: suksess(action.navn),
            };
        }
        case KandidatlisteActionType.HENT_USYNLIG_KANDIDAT_FAILURE: {
            return {
                ...state,
                søkPåusynligKandidat:
                    action.error.status === 404 ? finnesIkke() : feil(action.error),
            };
        }
        case KandidatlisteActionType.LEGG_TIL_KANDIDATER:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.LOADING,
                },
            };
        case KandidatlisteActionType.LEGG_TIL_KANDIDATER_SUCCESS: {
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
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    antallLagredeKandidater: action.antallLagredeKandidater,
                    lagretListe: action.lagretListe,
                },
                kandidatliste: suksess(action.kandidatliste),
                kandidattilstander,
                kandidatnotater,
            };
        }
        case KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                },
            };

        case KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET:
            return {
                ...state,
                leggTilKandidater: {
                    lagreStatus: LAGRE_STATUS.UNSAVED,
                    antallLagredeKandidater: 0,
                    lagretListe: {},
                },
            };
        case KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.LOADING,
            };
        case KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.SUCCESS,
            };
        case KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.FAILURE,
            };
        case KandidatlisteActionType.FORMIDLE_USYNLIG_KANDIDAT: {
            return {
                ...state,
                formidlingAvUsynligKandidat: senderInn(action.formidling),
            };
        }
        case KandidatlisteActionType.FORMIDLE_USYNLIG_KANDIDAT_SUCCESS: {
            return {
                ...state,
                formidlingAvUsynligKandidat: suksess(action.formidling),
                kandidatliste: suksess(action.kandidatliste),
            };
        }
        case KandidatlisteActionType.FORMIDLE_USYNLIG_KANDIDAT_FAILURE: {
            return {
                ...state,
                formidlingAvUsynligKandidat: feil(action.error),
            };
        }
        case KandidatlisteActionType.HENT_NOTATER:
            return {
                ...state,
                kandidatnotater: {
                    ...state.kandidatnotater,
                    [action.kandidatnr]: lasterInn(),
                },
            };
        case KandidatlisteActionType.HENT_NOTATER_SUCCESS:
        case KandidatlisteActionType.OPPRETT_NOTAT_SUCCESS:
        case KandidatlisteActionType.ENDRE_NOTAT_SUCCESS:
        case KandidatlisteActionType.SLETT_NOTAT_SUCCESS:
            return {
                ...state,
                kandidatnotater: {
                    ...state.kandidatnotater,
                    [action.kandidatnr]: suksess(action.notater),
                },
            };
        case KandidatlisteActionType.TOGGLE_ARKIVERT:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.LasterInn,
                },
            };
        case KandidatlisteActionType.TOGGLE_ARKIVERT_SUCCESS:
            return {
                ...oppdaterArkivertIKandidatlisteDetaljer(state, action.kandidat),
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.Suksess,
                },
            };
        case KandidatlisteActionType.TOGGLE_ARKIVERT_FAILURE:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusArkivering: Nettstatus.Feil,
                },
            };
        case KandidatlisteActionType.ANGRE_ARKIVERING:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.LasterInn,
                },
            };
        case KandidatlisteActionType.ANGRE_ARKIVERING_FAILURE:
            return {
                ...state,
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.Feil,
                },
            };
        case KandidatlisteActionType.ANGRE_ARKIVERING_SUCCESS:
            return {
                ...oppdaterDearkiverteKandidaterIKandidatlisteDetaljer(state, action.kandidatnumre),
                arkivering: {
                    ...state.arkivering,
                    statusDearkivering: Nettstatus.Suksess,
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HentStatus.Loading,
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HentStatus.Success,
                kandidatlisteMedAnnonsenummer: {
                    ...action.kandidatliste,
                    markert: true,
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HentStatus.FinnesIkke,
                hentListeMedAnnonsenummerStatusMessage: action.message,
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HentStatus.Failure,
            };
        case KandidatlisteActionType.SEND_SMS:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.UnderUtsending,
                },
            };
        case KandidatlisteActionType.SEND_SMS_SUCCESS:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.Sendt,
                },
            };
        case KandidatlisteActionType.SEND_SMS_FAILURE:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.Feil,
                    error: action.error,
                },
            };
        case KandidatlisteActionType.RESET_SEND_SMS_STATUS:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendStatus: SmsStatus.IkkeSendt,
                },
            };
        case KandidatlisteActionType.HENT_SENDTE_MELDINGER:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: lasterInn(),
                },
            };
        case KandidatlisteActionType.HENT_SENDTE_MELDINGER_SUCCESS:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: suksess<Sms[]>(action.sendteMeldinger),
                },
            };
        case KandidatlisteActionType.HENT_SENDTE_MELDINGER_FAILURE:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: feil(action.error),
                },
            };
        case KandidatlisteActionType.VELG_KANDIDAT: {
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
        case KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER: {
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

        case KandidatlisteActionType.TOGGLE_MARKERING_AV_KANDIDAT:
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

        case KandidatlisteActionType.ENDRE_MARKERING_AV_KANDIDATER:
            return {
                ...state,
                kandidattilstander: markerGitteKandidater(
                    state.kandidattilstander,
                    action.kandidatnumre
                ),
            };

        case KandidatlisteActionType.ENDRE_VISNINGSSTATUS_KANDIDAT:
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

        case KandidatlisteActionType.ENDRE_KANDIDATLISTESTATUS:
            return {
                ...state,
                endreKandidatlistestatus: Nettstatus.SenderInn,
            };

        case KandidatlisteActionType.ENDRE_KANDIDATLISTESTATUS_SUCCESS:
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
