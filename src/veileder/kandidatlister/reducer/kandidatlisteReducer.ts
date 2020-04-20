import { SearchApiError } from './../../../felles/api';
import { SmsStatus, Sms, Kandidat } from './../kandidatlistetyper';
import KandidatlisteActionType from './KandidatlisteActionType';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import { Reducer } from 'redux';
import {
    Failure,
    Loading,
    NotAsked,
    RemoteData,
    Nettstatus,
    Success,
} from '../../../felles/common/remoteData';
import KandidatlisteAction from './KandidatlisteAction';
import {
    Kandidatliste,
    Delestatus,
    HentStatus,
    MarkerSomMinStatus,
    KandidatlisteResponse,
    Notat,
} from '../kandidatlistetyper';

export interface KandidatlisteState {
    lagreStatus: string;
    detaljer: {
        kandidatliste: RemoteData<Kandidatliste>;
        deleStatus: Delestatus;
    };
    opprett: {
        lagreStatus: string;
        opprettetKandidatlisteTittel?: string;
    };
    fodselsnummer?: string;
    hentStatus: HentStatus;
    kandidat: {
        arenaKandidatnr?: string;
        fornavn?: string;
        etternavn?: string;
        mestRelevanteYrkeserfaring: {
            styrkKodeStillingstittel?: string;
            yrkeserfaringManeder?: string;
        };
    };
    leggTilKandidater: {
        lagreStatus: string;
        antallLagredeKandidater: number;
        lagretListe: {};
    };
    hentListerStatus: HentStatus;
    kandidatlister: {
        liste: Array<any>;
        antall?: number;
    };
    hentListeMedAnnonsenummerStatus: HentStatus;
    kandidatlisteMedAnnonsenummer?: any;
    lagreKandidatIKandidatlisteStatus: string;
    kandidatlisterSokeKriterier: {
        query: string;
        type: string;
        kunEgne: boolean;
        pagenumber: number;
        pagesize: number;
    };
    markerSomMinStatus: MarkerSomMinStatus;
    slettKandidatlisteStatus: RemoteData<{
        slettetTittel: string;
    }>;
    sms: {
        sendStatus: SmsStatus;
        sendteMeldinger: RemoteData<Sms[]>;
        error?: SearchApiError;
    };
    arkivering: {
        statusArkivering: Nettstatus;
        statusDearkivering: Nettstatus;
    };
}

const initialState: KandidatlisteState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    detaljer: {
        kandidatliste: NotAsked(),
        deleStatus: Delestatus.IkkeSpurt,
    },
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined,
    },
    fodselsnummer: undefined,
    hentStatus: HentStatus.IkkeHentet,
    kandidat: {
        arenaKandidatnr: undefined,
        fornavn: undefined,
        etternavn: undefined,
        mestRelevanteYrkeserfaring: {
            styrkKodeStillingstittel: undefined,
            yrkeserfaringManeder: undefined,
        },
    },
    leggTilKandidater: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        antallLagredeKandidater: 0,
        lagretListe: {},
    },
    hentListerStatus: HentStatus.IkkeHentet,
    kandidatlister: {
        liste: [],
        antall: undefined,
    },
    hentListeMedAnnonsenummerStatus: HentStatus.IkkeHentet,
    kandidatlisteMedAnnonsenummer: undefined,
    lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.UNSAVED,
    kandidatlisterSokeKriterier: {
        query: '',
        type: '',
        kunEgne: true,
        pagenumber: 0,
        pagesize: 20,
    },
    markerSomMinStatus: MarkerSomMinStatus.IkkeGjort,
    slettKandidatlisteStatus: NotAsked(),
    sms: {
        sendStatus: SmsStatus.IkkeSendt,
        sendteMeldinger: NotAsked(),
    },
    arkivering: {
        statusArkivering: Nettstatus.IkkeLastet,
        statusDearkivering: Nettstatus.IkkeLastet,
    },
};

const overforNotater: (
    response: KandidatlisteResponse,
    prevKandidatliste: Kandidatliste
) => Kandidatliste = (response, prevKandidatliste) => {
    const notaterMap: { [index: string]: Array<Notat> } = prevKandidatliste.kandidater.reduce(
        (notaterMap, kandidat) => {
            if (kandidat.notater.kind === Nettstatus.Suksess) {
                return {
                    ...notaterMap,
                    [kandidat.kandidatId]: kandidat.notater.data,
                };
            }
            return notaterMap;
        },
        {}
    );
    return {
        ...response,
        kandidater: response.kandidater.map((kandidat) => ({
            ...kandidat,
            notater: notaterMap[kandidat.kandidatId]
                ? Success(notaterMap[kandidat.kandidatId])
                : NotAsked(),
        })),
    };
};

const leggTilNotater: (
    response: KandidatlisteResponse,
    prevKandidatliste: RemoteData<Kandidatliste>
) => Kandidatliste = (response, prevKandidatliste) => {
    if (prevKandidatliste.kind === Nettstatus.Suksess) {
        return overforNotater(response, prevKandidatliste.data);
    }
    return {
        ...response,
        kandidater: response.kandidater.map((kandidat) => ({
            ...kandidat,
            notater: NotAsked(),
        })),
    };
};

const oppdaterNotaterIKandidatlisteDetaljer: (
    state: KandidatlisteState,
    kandidatnr: string,
    notater: RemoteData<Array<Notat>>
) => KandidatlisteState = (state, kandidatnr, notater) => {
    if (state.detaljer.kandidatliste.kind === Nettstatus.Suksess) {
        return {
            ...state,
            detaljer: {
                ...state.detaljer,
                kandidatliste: {
                    ...state.detaljer.kandidatliste,
                    data: {
                        ...state.detaljer.kandidatliste.data,
                        kandidater: state.detaljer.kandidatliste.data.kandidater.map((kandidat) => {
                            if (kandidat.kandidatnr === kandidatnr) {
                                return {
                                    ...kandidat,
                                    notater: notater,
                                };
                            }
                            return kandidat;
                        }),
                    },
                },
            },
        };
    }
    return state;
};

const oppdaterArkivertIKandidatlisteDetaljer = (
    state: KandidatlisteState,
    kandidat: Kandidat
): KandidatlisteState => {
    const kandidatliste = state.detaljer.kandidatliste;
    if (kandidatliste.kind === Nettstatus.Suksess) {
        return {
            ...state,
            detaljer: {
                ...state.detaljer,
                kandidatliste: {
                    ...kandidatliste,
                    data: {
                        ...kandidatliste.data,
                        kandidater: kandidatliste.data.kandidater.map((utdatertKandidat) =>
                            utdatertKandidat.kandidatnr === kandidat.kandidatnr
                                ? {
                                      ...utdatertKandidat,
                                      arkivert: kandidat.arkivert,
                                      arkivertTidspunkt: kandidat.arkivertTidspunkt,
                                  }
                                : utdatertKandidat
                        ),
                    },
                },
            },
        };
    }
    return state;
};

const oppdaterDearkiverteKandidaterIKandidatlisteDetaljer = (
    state: KandidatlisteState,
    kandidatnumre: string[]
): KandidatlisteState => {
    const kandidatliste = state.detaljer.kandidatliste;
    if (kandidatliste.kind === Nettstatus.Suksess) {
        return {
            ...state,
            detaljer: {
                ...state.detaljer,
                kandidatliste: {
                    ...kandidatliste,
                    data: {
                        ...kandidatliste.data,
                        kandidater: kandidatliste.data.kandidater.map((utdatertKandidat) =>
                            kandidatnumre.includes(utdatertKandidat.kandidatnr)
                                ? {
                                      ...utdatertKandidat,
                                      arkivert: false,
                                      arkivertTidspunkt: undefined,
                                  }
                                : utdatertKandidat
                        ),
                    },
                },
            },
        };
    }
    return state;
};

const reducer: Reducer<KandidatlisteState, KandidatlisteAction> = (
    state = initialState,
    action
) => {
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
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Loading(),
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS:
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE:
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Failure(action.error),
                },
            };
        case KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                },
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: Delestatus.Loading,
                },
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                    deleStatus: Delestatus.Success,
                },
            };
        case KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: Delestatus.IkkeSpurt,
                },
            };
        case KandidatlisteActionType.RESET_DELESTATUS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: Delestatus.IkkeSpurt,
                },
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
        case KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_RESET: {
            return {
                ...state,
                hentStatus: HentStatus.IkkeHentet,
                kandidat: initialState.kandidat,
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
        case KandidatlisteActionType.LEGG_TIL_KANDIDATER_SUCCESS:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    antallLagredeKandidater: action.antallLagredeKandidater,
                    lagretListe: action.lagretListe,
                },
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                },
            };
        case KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.FAILURE,
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
        case KandidatlisteActionType.HENT_NOTATER:
            return oppdaterNotaterIKandidatlisteDetaljer(state, action.kandidatnr, Loading());
        case KandidatlisteActionType.HENT_NOTATER_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteActionType.OPPRETT_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteActionType.ENDRE_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteActionType.SLETT_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
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
        case KandidatlisteActionType.HENT_KANDIDATLISTER:
            return {
                ...state,
                hentListerStatus: HentStatus.Loading,
                kandidatlisterSokeKriterier: {
                    query: action.query,
                    type: action.listetype,
                    kunEgne: action.kunEgne,
                    pagenumber: action.pagenumber,
                    pagesize: action.pagesize,
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                hentListerStatus: HentStatus.Success,
                kandidatlister: {
                    liste: action.kandidatlister.liste,
                    antall: action.kandidatlister.antall,
                },
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                hentListerStatus: HentStatus.Failure,
            };
        case KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER:
            return {
                ...state,
                kandidatlister: {
                    liste: [],
                    antall: undefined,
                },
                kandidatlisterSokeKriterier: {
                    query: '',
                    type: '',
                    kunEgne: true,
                    pagenumber: 0,
                    pagesize: 20,
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
            };
        case KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HentStatus.Failure,
            };
        case KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Loading,
            };
        case KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Success,
            };
        case KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Failure,
            };
        case KandidatlisteActionType.SLETT_KANDIDATLISTE:
            return {
                ...state,
                slettKandidatlisteStatus: Loading(),
            };
        case KandidatlisteActionType.SLETT_KANDIDATLISTE_FERDIG:
            return {
                ...state,
                slettKandidatlisteStatus:
                    action.result.kind === Nettstatus.Suksess
                        ? Success({ slettetTittel: action.kandidatlisteTittel })
                        : action.result,
            };
        case KandidatlisteActionType.RESET_SLETTE_STATUS:
            return {
                ...state,
                slettKandidatlisteStatus: NotAsked(),
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
                    sendteMeldinger: Loading(),
                },
            };
        case KandidatlisteActionType.HENT_SENDTE_MELDINGER_SUCCESS:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: Success<Sms[]>(action.sendteMeldinger),
                },
            };
        case KandidatlisteActionType.HENT_SENDTE_MELDINGER_FAILURE:
            return {
                ...state,
                sms: {
                    ...state.sms,
                    sendteMeldinger: Failure(action.error),
                },
            };
        default:
            return state;
    }
};

export default reducer;
