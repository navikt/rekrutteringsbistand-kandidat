import { call, put, select, takeLatest } from 'redux-saga/effects';
import { INVALID_RESPONSE_STATUS } from '../../sok/searchReducer';
import { SearchApiError } from '../../../felles/api';
import KandidatlisteActionType from './KandidatlisteActionType';
import {
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
import { RemoteDataTypes } from '../../../felles/common/remoteData';

function* opprettKandidatliste(action: OpprettKandidatlisteAction) {
    try {
        yield postKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE_SUCCESS,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE_FAILURE, error: e });
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
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
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
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield opprettKandidatlisteForStilling(stillingsId, e);
            } else {
                yield put({
                    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
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
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE,
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
            type: KandidatlisteActionType.PRESENTER_KANDIDATER_SUCCESS,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE, error: e });
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
            type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_SUCCESS,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatMedFnr(action: HentKandidatMedFnrAction) {
    try {
        const response = yield fetchKandidatMedFnr(action.fodselsnummer);
        yield put({
            type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_SUCCESS,
            kandidat: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_NOT_FOUND });
            } else {
                yield put({
                    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_FAILURE,
                    error: e,
                });
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
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_SUCCESS,
            kandidatliste: response,
            antallLagredeKandidater: action.kandidater.length,
            lagretListe: action.kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* lagreKandidatIKandidatliste(action) {
    try {
        const response = yield call(fetchKandidatMedFnr, action.fodselsnummer);
        yield call(leggTilKandidater, {
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER,
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

        yield put({ type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE,
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
            type: KandidatlisteActionType.HENT_NOTATER_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.HENT_NOTATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* opprettNotat(action: OpprettNotatAction) {
    try {
        const response = yield postNotat(action.kandidatlisteId, action.kandidatnr, action.tekst);
        yield put({
            type: KandidatlisteActionType.OPPRETT_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OPPRETT_NOTAT_FAILURE, error: e });
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
        yield put({ type: KandidatlisteActionType.HENT_KANDIDATLISTER_SUCCESS, kandidatlister });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedAnnonsenummer(action) {
    try {
        const kandidatliste = yield fetchKandidatlisteMedAnnonsenummer(action.annonsenummer);
        yield put({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({
                    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND,
                });
            } else {
                yield put({
                    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE,
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
            type: KandidatlisteActionType.ENDRE_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.ENDRE_NOTAT_FAILURE, error: e });
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
            type: KandidatlisteActionType.SLETT_NOTAT_SUCCESS,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.SLETT_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* toggleErSlettet(action) {
    try {
        yield putErSlettet(action.kandidatlisteId, action.kandidatnr, action.erSlettet);
        yield put({
            type: KandidatlisteActionType.TOGGLE_ER_SLETTET_SUCCESS,
            kandidatnr: action.kandidatnr,
            erSlettet: action.erSlettet,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.TOGGLE_ER_SLETTET_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* oppdaterKandidatliste(action) {
    try {
        yield putOppdaterKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE_SUCCESS,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* markerKandidatlisteSomMin(action) {
    try {
        yield endreEierskapPaKandidatliste(action.kandidatlisteId);
        yield put({ type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* slettKandidatliste(action: SlettKandidatlisteAction) {
    const response = yield call(deleteKandidatliste, action.kandidatliste.kandidatlisteId);
    yield put({
        type: KandidatlisteActionType.SLETT_KANDIDATLISTE_FERDIG,
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

function* kandidatlisteSaga() {
    yield takeLatest(KandidatlisteActionType.OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(
        KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
        hentKandidatlisteMedStillingsId
    );
    yield takeLatest(
        KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
        hentKandidatlisteMedKandidatlisteId
    );
    yield takeLatest(KandidatlisteActionType.PRESENTER_KANDIDATER, presenterKandidater);
    yield takeLatest(KandidatlisteActionType.ENDRE_STATUS_KANDIDAT, endreKandidatstatus);
    yield takeLatest(KandidatlisteActionType.HENT_KANDIDAT_MED_FNR, hentKandidatMedFnr);
    yield takeLatest(KandidatlisteActionType.LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(KandidatlisteActionType.HENT_NOTATER, hentNotater);
    yield takeLatest(KandidatlisteActionType.OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(KandidatlisteActionType.ENDRE_NOTAT, endreNotat);
    yield takeLatest(KandidatlisteActionType.SLETT_NOTAT, slettNotat);
    yield takeLatest(KandidatlisteActionType.TOGGLE_ER_SLETTET, toggleErSlettet);
    yield takeLatest(KandidatlisteActionType.HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest(
        KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER,
        hentKandidatlisteMedAnnonsenummer
    );
    yield takeLatest(
        KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE,
        lagreKandidatIKandidatliste
    );
    yield takeLatest(KandidatlisteActionType.OPPDATER_KANDIDATLISTE, oppdaterKandidatliste);
    yield takeLatest(
        KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN,
        markerKandidatlisteSomMin
    );
    yield takeLatest(KandidatlisteActionType.SLETT_KANDIDATLISTE, slettKandidatliste);
    yield takeLatest(
        [
            KandidatlisteActionType.OPPRETT_KANDIDATLISTE_FAILURE,
            KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
            KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE,
            KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_FAILURE,
            KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE,
            KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_FAILURE,
            KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE,
            KandidatlisteActionType.OPPRETT_NOTAT_FAILURE,
            KandidatlisteActionType.ENDRE_NOTAT_FAILURE,
            KandidatlisteActionType.TOGGLE_ER_SLETTET_FAILURE,
            KandidatlisteActionType.SLETT_NOTAT_FAILURE,
            KandidatlisteActionType.HENT_KANDIDATLISTER_FAILURE,
            KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE,
            KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE,
        ],
        sjekkError
    );
    yield takeLatest(
        [KandidatlisteActionType.SLETT_KANDIDATLISTE_FERDIG],
        sjekkFerdigActionForError
    );
}

export default kandidatlisteSaga;
