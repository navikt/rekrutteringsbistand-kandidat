import KandidatlisteAction, {
    SlettKandidatlisteAction,
    SlettKandidatlisteFerdigAction,
    OpprettKandidatlisteAction,
    HentKandidatlisteMedStillingsIdAction,
    HentKandidatlisteMedKandidatlisteIdAction,
    PresenterKandidaterAction,
    EndreStatusKandidatAction,
    HentKandidatMedFnrAction,
    LeggTilKandidaterAction,
    HentNotaterAction,
    OpprettNotatAction,
    EndreNotatAction,
} from './KandidatlisteAction';
import KandidatlisteTypes from './KandidatlisteTypes';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    deleteKandidatliste,
    deleteNotat,
    endreEierskapPaKandidatliste,
    fetchKandidatlisteMedAnnonsenummer,
    fetchKandidatlisteMedKandidatlisteId,
    fetchKandidatlisteMedStillingsId,
    fetchKandidatlister,
    fetchKandidatMedFnr,
    fetchNotater,
    postDelteKandidater,
    postKandidaterTilKandidatliste,
    postKandidatliste,
    postNotat,
    putKandidatliste,
    putNotat,
    putOppdaterKandidatliste,
    putStatusKandidat,
    putErSlettet,
} from '../../api';
import { INVALID_RESPONSE_STATUS } from '../../sok/searchReducer';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import { Reducer } from 'redux';
import {
    Failure,
    Loading,
    NotAsked,
    RemoteData,
    RemoteDataTypes,
    Success,
} from '../../../felles/common/remoteData';
import { SearchApiError } from '../../../felles/api';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export enum DELE_STATUS {
    IKKE_SPURT = 'IKKE_SPURT',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
}

export enum HENT_STATUS {
    IKKE_HENTET = 'IKKE_HENTET',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    FINNES_IKKE = 'FINNES_IKKE',
    FAILURE = 'FAILURE',
}

export enum MARKER_SOM_MIN_STATUS {
    IKKE_GJORT = 'IKKE_GJORT',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export interface KandidatResponse {
    kandidatId: string;
    kandidatnr: string;
    sisteArbeidserfaring: string;
    status: string;
    lagtTilTidspunkt: string;
    lagtTilAv: {
        ident: string;
        navn: string;
    };
    fornavn: string;
    etternavn: string;
    epost?: string;
    telefon?: string;
    fodselsdato: string;
    fodselsnr: string;
    innsatsgruppe: string;
    utfall: string;
    erSynlig: boolean;
}

export interface Notat {
    tekst: string;
    notatId: string;
    lagtTilTidspunkt: string;
    notatEndret: boolean;
    kanEditere: boolean;
    lagtTilAv: {
        navn: string;
        ident: string;
    };
}

interface KandidatExtension {
    notater: RemoteData<Array<Notat>>;
}

export type Kandidat = KandidatResponse & KandidatExtension;

export type KandidatIKandidatliste = Kandidat & {
    notaterVises: boolean;
    antallNotater: number;
    markert: boolean;
    visningsstatus: string;
};

interface KandidatlisteBase {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse: string;
    organisasjonReferanse: string;
    organisasjonNavn: string;
    stillingId: string;
    opprettetAv: {
        ident: string;
        navn: string;
    };
    opprettetTidspunkt: string;
}

interface KandidatlisteResponseExtension {
    kandidater: Array<KandidatResponse>;
}

interface KandidatlisteExtension {
    kandidater: Array<Kandidat>;
}

export type KandidatlisteResponse = KandidatlisteBase & KandidatlisteResponseExtension;

type Kandidatliste = KandidatlisteBase & KandidatlisteExtension;

interface KandidatlisteState {
    lagreStatus: string;
    detaljer: {
        kandidatliste: RemoteData<Kandidatliste>;
        deleStatus: DELE_STATUS;
    };
    opprett: {
        lagreStatus: string;
        opprettetKandidatlisteTittel?: string;
    };
    fodselsnummer?: string;
    hentStatus: HENT_STATUS;
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
    hentListerStatus: HENT_STATUS;
    kandidatlister: {
        liste: Array<any>;
        antall?: number;
    };
    hentListeMedAnnonsenummerStatus: HENT_STATUS;
    kandidatlisteMedAnnonsenummer?: any;
    lagreKandidatIKandidatlisteStatus: string;
    kandidatlisterSokeKriterier: {
        query: string;
        type: string;
        kunEgne: boolean;
        pagenumber: number;
        pagesize: number;
    };
    markerSomMinStatus: MARKER_SOM_MIN_STATUS;
    slettKandidatlisteStatus: RemoteData<{
        slettetTittel: string;
    }>;
}

const initialState: KandidatlisteState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    detaljer: {
        kandidatliste: NotAsked(),
        deleStatus: DELE_STATUS.IKKE_SPURT,
    },
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined,
    },
    fodselsnummer: undefined,
    hentStatus: HENT_STATUS.IKKE_HENTET,
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
    hentListerStatus: HENT_STATUS.IKKE_HENTET,
    kandidatlister: {
        liste: [],
        antall: undefined,
    },
    hentListeMedAnnonsenummerStatus: HENT_STATUS.IKKE_HENTET,
    kandidatlisteMedAnnonsenummer: undefined,
    lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.UNSAVED,
    kandidatlisterSokeKriterier: {
        query: '',
        type: '',
        kunEgne: true,
        pagenumber: 0,
        pagesize: 20,
    },
    markerSomMinStatus: MARKER_SOM_MIN_STATUS.IKKE_GJORT,
    slettKandidatlisteStatus: NotAsked(),
};

const overforNotater: (
    response: KandidatlisteResponse,
    prevKandidatliste: Kandidatliste
) => Kandidatliste = (response, prevKandidatliste) => {
    const notaterMap: { [index: string]: Array<Notat> } = prevKandidatliste.kandidater.reduce(
        (notaterMap, kandidat) => {
            if (kandidat.notater.kind === RemoteDataTypes.SUCCESS) {
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
        kandidater: response.kandidater.map(kandidat => ({
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
    if (prevKandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return overforNotater(response, prevKandidatliste.data);
    }
    return {
        ...response,
        kandidater: response.kandidater.map(kandidat => ({
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
    if (state.detaljer.kandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return {
            ...state,
            detaljer: {
                ...state.detaljer,
                kandidatliste: {
                    ...state.detaljer.kandidatliste,
                    data: {
                        ...state.detaljer.kandidatliste.data,
                        kandidater: state.detaljer.kandidatliste.data.kandidater.map(kandidat => {
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

const oppdaterErSlettetIKandidatlisteDetaljer: (
    state: KandidatlisteState,
    kandidatnr: string,
    erSlettet: boolean
) => KandidatlisteState = (state, kandidatnr, erSlettet) => {
    if (state.detaljer.kandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return {
            ...state,
            detaljer: {
                ...state.detaljer,
                kandidatliste: {
                    ...state.detaljer.kandidatliste,
                    kandidater: state.detaljer.kandidatliste.data.kandidater.map(kandidat => {
                        if (kandidat.kandidatnr === kandidatnr) {
                            return {
                                ...kandidat,
                                erSlettet,
                            };
                        }
                        return kandidat;
                    }),
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
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE:
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.LOADING,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS:
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    opprettetKandidatlisteTittel: action.tittel,
                },
            };
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE:
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined,
                },
            };
        case KandidatlisteTypes.RESET_LAGRE_STATUS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.UNSAVED,
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID:
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Loading(),
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS:
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE:
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Failure(action.error),
                },
            };
        case KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                },
            };
        case KandidatlisteTypes.PRESENTER_KANDIDATER:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.LOADING,
                },
            };
        case KandidatlisteTypes.PRESENTER_KANDIDATER_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: Success(
                        leggTilNotater(action.kandidatliste, state.detaljer.kandidatliste)
                    ),
                    deleStatus: DELE_STATUS.SUCCESS,
                },
            };
        case KandidatlisteTypes.PRESENTER_KANDIDATER_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.IKKE_SPURT,
                },
            };
        case KandidatlisteTypes.RESET_DELE_STATUS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.IKKE_SPURT,
                },
            };
        case KandidatlisteTypes.SET_FODSELSNUMMER: {
            return {
                ...state,
                fodselsnummer: action.fodselsnummer,
            };
        }
        case KandidatlisteTypes.SET_NOTAT:
            return {
                ...state,
                notat: action.notat,
            };
        case KandidatlisteTypes.HENT_KANDIDAT_MED_FNR: {
            return {
                ...state,
                hentStatus: HENT_STATUS.LOADING,
            };
        }
        case KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_SUCCESS: {
            return {
                ...state,
                hentStatus: HENT_STATUS.SUCCESS,
                kandidat: action.kandidat,
            };
        }
        case KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_NOT_FOUND: {
            return {
                ...state,
                hentStatus: HENT_STATUS.FINNES_IKKE,
            };
        }
        case KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_FAILURE: {
            return {
                ...state,
                hentStatus: HENT_STATUS.FAILURE,
            };
        }
        case KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_RESET: {
            return {
                ...state,
                hentStatus: HENT_STATUS.IKKE_HENTET,
                kandidat: initialState.kandidat,
            };
        }
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.LOADING,
                },
            };
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS:
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
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                },
            };
        case KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.LOADING,
            };
        case KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.SUCCESS,
            };
        case KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.FAILURE,
            };
        case KandidatlisteTypes.HENT_NOTATER:
            return oppdaterNotaterIKandidatlisteDetaljer(state, action.kandidatnr, Loading());
        case KandidatlisteTypes.HENT_NOTATER_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteTypes.OPPRETT_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteTypes.ENDRE_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteTypes.SLETT_NOTAT_SUCCESS:
            return oppdaterNotaterIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                Success(action.notater)
            );
        case KandidatlisteTypes.TOGGLE_ER_SLETTET_SUCCESS:
            return oppdaterErSlettetIKandidatlisteDetaljer(
                state,
                action.kandidatnr,
                action.erSlettet
            );
        case KandidatlisteTypes.HENT_KANDIDATLISTER:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.LOADING,
                kandidatlisterSokeKriterier: {
                    query: action.query,
                    type: action.listetype,
                    kunEgne: action.kunEgne,
                    pagenumber: action.pagenumber,
                    pagesize: action.pagesize,
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.SUCCESS,
                kandidatlister: {
                    liste: action.kandidatlister.liste,
                    antall: action.kandidatlister.antall,
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.FAILURE,
            };
        case KandidatlisteTypes.RESET_KANDIDATLISTER_SOKEKRITERIER:
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
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.LOADING,
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.SUCCESS,
                kandidatlisteMedAnnonsenummer: {
                    ...action.kandidatliste,
                    markert: true,
                },
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.FINNES_IKKE,
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.FAILURE,
            };
        case KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN:
            return {
                ...state,
                markerSomMinStatus: MARKER_SOM_MIN_STATUS.LOADING,
            };
        case KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS:
            return {
                ...state,
                markerSomMinStatus: MARKER_SOM_MIN_STATUS.SUCCESS,
            };
        case KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE:
            return {
                ...state,
                markerSomMinStatus: MARKER_SOM_MIN_STATUS.FAILURE,
            };
        case KandidatlisteTypes.SLETT_KANDIDATLISTE:
            return {
                ...state,
                slettKandidatlisteStatus: Loading(),
            };
        case KandidatlisteTypes.SLETT_KANDIDATLISTE_FERDIG:
            return {
                ...state,
                slettKandidatlisteStatus:
                    action.result.kind === RemoteDataTypes.SUCCESS
                        ? Success({ slettetTittel: action.kandidatlisteTittel })
                        : action.result,
            };
        case KandidatlisteTypes.RESET_SLETTE_STATUS:
            return {
                ...state,
                slettKandidatlisteStatus: NotAsked(),
            };
        default:
            return state;
    }
};

export default reducer;

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatliste(action: OpprettKandidatlisteAction) {
    try {
        yield postKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* opprettKandidatlisteForStilling(stillingsId, opprinneligError) {
    try {
        yield putKandidatliste(stillingsId);
        const kandidatliste = yield fetchKandidatlisteMedStillingsId(stillingsId);
        yield put({
            type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
                error: opprinneligError,
            });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedStillingsId(action: HentKandidatlisteMedStillingsIdAction) {
    const { stillingsId } = action;
    try {
        const kandidatliste = yield fetchKandidatlisteMedStillingsId(stillingsId);
        yield put({
            type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield opprettKandidatlisteForStilling(stillingsId, e);
            } else {
                yield put({
                    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
                    error: e,
                });
            }
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedKandidatlisteId(action: HentKandidatlisteMedKandidatlisteIdAction) {
    const { kandidatlisteId } = action;
    try {
        const kandidatliste = yield fetchKandidatlisteMedKandidatlisteId(kandidatlisteId);
        yield put({
            type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* presenterKandidater(action: PresenterKandidaterAction) {
    try {
        const { beskjed, mailadresser, kandidatlisteId, kandidatnummerListe } = action;
        const response = yield postDelteKandidater(
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe
        );
        yield put({
            type: KandidatlisteTypes.PRESENTER_KANDIDATER_SUCCESS,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.PRESENTER_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* endreKandidatstatus(action: EndreStatusKandidatAction) {
    const { status, kandidatlisteId, kandidatnr } = action;
    try {
        const response = yield putStatusKandidat(status, kandidatlisteId, kandidatnr);
        yield put({
            type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_SUCCESS,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatMedFnr(action: HentKandidatMedFnrAction) {
    try {
        const response = yield fetchKandidatMedFnr(action.fodselsnummer);
        yield put({ type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_SUCCESS, kandidat: response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_NOT_FOUND });
            } else {
                yield put({ type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* leggTilKandidater(action: LeggTilKandidaterAction) {
    try {
        const response = yield postKandidaterTilKandidatliste(
            action.kandidatliste.kandidatlisteId,
            action.kandidater
        );
        yield put({
            type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS,
            kandidatliste: response,
            antallLagredeKandidater: action.kandidater.length,
            lagretListe: action.kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* lagreKandidatIKandidatliste(action) {
    try {
        const response = yield call(fetchKandidatMedFnr, action.fodselsnummer);
        yield call(leggTilKandidater, {
            type: KandidatlisteTypes.LEGG_TIL_KANDIDATER,
            kandidatliste: action.kandidatliste,
            kandidater: [
                {
                    kandidatnr: response.arenaKandidatnr,
                    notat: action.notat,
                    sisteArbeidserfaring: response.mestRelevanteYrkeserfaring
                        ? response.mestRelevanteYrkeserfaring.styrkKodeStillingstittel
                        : '',
                },
            ],
        });

        yield put({ type: KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* hentNotater(action: HentNotaterAction) {
    try {
        const response = yield fetchNotater(action.kandidatlisteId, action.kandidatnr);
        yield put({
            type: KandidatlisteTypes.HENT_NOTATER_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.HENT_NOTATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* opprettNotat(action: OpprettNotatAction) {
    try {
        const response = yield postNotat(action.kandidatlisteId, action.kandidatnr, action.tekst);
        yield put({
            type: KandidatlisteTypes.OPPRETT_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.OPPRETT_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlister() {
    const state = yield select();
    try {
        const kandidatlister = yield fetchKandidatlister(
            state.kandidatlister.kandidatlisterSokeKriterier
        );
        yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS, kandidatlister });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedAnnonsenummer(action) {
    try {
        const kandidatliste = yield fetchKandidatlisteMedAnnonsenummer(action.annonsenummer);
        yield put({
            type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({
                    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND,
                });
            } else {
                yield put({
                    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE,
                    error: e,
                });
            }
        } else {
            throw e;
        }
    }
}

function* endreNotat(action: EndreNotatAction) {
    try {
        const response = yield putNotat(
            action.kandidatlisteId,
            action.kandidatnr,
            action.notatId,
            action.tekst
        );
        yield put({
            type: KandidatlisteTypes.ENDRE_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.ENDRE_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettNotat(action) {
    try {
        const response = yield deleteNotat(
            action.kandidatlisteId,
            action.kandidatnr,
            action.notatId
        );
        yield put({
            type: KandidatlisteTypes.SLETT_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.SLETT_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* toggleErSlettet(action) {
    try {
        yield putErSlettet(action.kandidatlisteId, action.kandidatnr, action.erSlettet);
        yield put({
            type: KandidatlisteTypes.TOGGLE_ER_SLETTET_SUCCESS,
            kandidatnr: action.kandidatnr,
            erSlettet: action.erSlettet,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.TOGGLE_ER_SLETTET_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* oppdaterKandidatliste(action) {
    try {
        yield putOppdaterKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* markerKandidatlisteSomMin(action) {
    try {
        yield endreEierskapPaKandidatliste(action.kandidatlisteId);
        yield put({ type: KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidatliste(action: SlettKandidatlisteAction) {
    const response = yield call(deleteKandidatliste, action.kandidatliste.kandidatlisteId);
    yield put({
        type: KandidatlisteTypes.SLETT_KANDIDATLISTE_FERDIG,
        result: response,
        kandidatlisteTittel: action.kandidatliste.tittel,
    });
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

function* sjekkFerdigActionForError(action: SlettKandidatlisteFerdigAction) {
    if (action.result.kind === RemoteDataTypes.FAILURE) {
        yield put({ type: INVALID_RESPONSE_STATUS, error: action.result.error });
    }
}

export function* kandidatlisteSaga() {
    yield takeLatest(KandidatlisteTypes.OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(
        KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
        hentKandidatlisteMedStillingsId
    );
    yield takeLatest(
        KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
        hentKandidatlisteMedKandidatlisteId
    );
    yield takeLatest(KandidatlisteTypes.PRESENTER_KANDIDATER, presenterKandidater);
    yield takeLatest(KandidatlisteTypes.ENDRE_STATUS_KANDIDAT, endreKandidatstatus);
    yield takeLatest(KandidatlisteTypes.HENT_KANDIDAT_MED_FNR, hentKandidatMedFnr);
    yield takeLatest(KandidatlisteTypes.LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(KandidatlisteTypes.HENT_NOTATER, hentNotater);
    yield takeLatest(KandidatlisteTypes.OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(KandidatlisteTypes.ENDRE_NOTAT, endreNotat);
    yield takeLatest(KandidatlisteTypes.SLETT_NOTAT, slettNotat);
    yield takeLatest(KandidatlisteTypes.TOGGLE_ER_SLETTET, toggleErSlettet);
    yield takeLatest(KandidatlisteTypes.HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest(
        KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER,
        hentKandidatlisteMedAnnonsenummer
    );
    yield takeLatest(
        KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE,
        lagreKandidatIKandidatliste
    );
    yield takeLatest(KandidatlisteTypes.OPPDATER_KANDIDATLISTE, oppdaterKandidatliste);
    yield takeLatest(KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN, markerKandidatlisteSomMin);
    yield takeLatest(KandidatlisteTypes.SLETT_KANDIDATLISTE, slettKandidatliste);
    yield takeLatest(
        [
            KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE,
            KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
            KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE,
            KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_FAILURE,
            KandidatlisteTypes.PRESENTER_KANDIDATER_FAILURE,
            KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_FAILURE,
            KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE,
            KandidatlisteTypes.OPPRETT_NOTAT_FAILURE,
            KandidatlisteTypes.ENDRE_NOTAT_FAILURE,
            KandidatlisteTypes.TOGGLE_ER_SLETTET_FAILURE,
            KandidatlisteTypes.SLETT_NOTAT_FAILURE,
            KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE,
            KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE,
            KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE,
        ],
        sjekkError
    );
    yield takeLatest([KandidatlisteTypes.SLETT_KANDIDATLISTE_FERDIG], sjekkFerdigActionForError);
}
