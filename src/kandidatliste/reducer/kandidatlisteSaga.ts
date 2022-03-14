import { sendEvent } from '../../amplitude/amplitude';
import {
    postSmsTilKandidater,
    fetchSendteMeldinger,
    putArkivertForFlereKandidater,
    putUtfallKandidat,
    fetchUsynligKandidat,
    postFormidlingerAvUsynligKandidat,
    putKandidatlistestatus,
    fetchSynlighetsevaluering,
} from '../../api/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import KandidatlisteActionType from './KandidatlisteActionType';
import KandidatlisteAction, {
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
    SendSmsAction,
    HentSendteMeldingerAction,
    ToggleArkivertAction,
    ToggleArkivertSuccessAction,
    AngreArkiveringAction,
    AngreArkiveringSuccessAction,
    EndreUtfallKandidatAction,
    EndreUtfallKandidatSuccessAction,
    HentUsynligKandidatAction,
    FormidleUsynligKandidatAction,
    EndreFormidlingsutfallForUsynligKandidatAction,
    EndreFormidlingsutfallForUsynligKandidatSuccessAction,
    EndreKandidatlistestatusAction,
    EndreKandidatlistestatusSuccessAction,
    HentForespørslerOmDelingAvCvAction,
    SendForespørselOmDelingAvCv,
    HentKandidatMedFnrSuccessAction,
    HentKandidatMedFnrFailureAction,
} from './KandidatlisteAction';
import {
    deleteNotat,
    fetchKandidatlisteMedAnnonsenummer,
    fetchKandidatlisteMedKandidatlisteId,
    fetchKandidatlisteMedStillingsId,
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
    putArkivert,
    putFormidlingsutfallForUsynligKandidat,
} from '../../api/api';
import { Kandidatliste } from '../domene/Kandidatliste';
import { SearchApiError } from '../../api/fetchUtils';
import {
    fetchForespørslerOmDelingAvCv,
    ForespørslerForStillingInboundDto,
    sendForespørselOmDelingAvCv,
} from '../../api/forespørselOmDelingAvCvApi';
import { Nettressurs, NettressursMedForklaring, Nettstatus } from '../../api/Nettressurs';
import { Fødselsnummersøk } from '../../kandidatside/cv/reducer/cv-typer';
import { Synlighetsevaluering } from '../modaler/legg-til-kandidat/kandidaten-finnes-ikke/Synlighetsevaluering';

const loggManglendeAktørId = (kandidatliste: Kandidatliste) => {
    const aktøridRegex = /[0-9]{13}/;
    const noenKandidaterManglerAktørId = kandidatliste.kandidater.some(
        (kandidat) => !kandidat.aktørid || !kandidat.aktørid.match(aktøridRegex)
    );

    if (noenKandidaterManglerAktørId) {
        sendEvent('kandidatliste', 'kandidat_mangler_aktørid', {
            kandidatlisteId: kandidatliste.kandidatlisteId,
        });
    }
};

function* opprettKandidatliste(action: OpprettKandidatlisteAction) {
    try {
        yield postKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteActionType.OpprettKandidatlisteSuccess,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OpprettKandidatlisteFailure, error: e });
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
            type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdSuccess,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdFailure,
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
        loggManglendeAktørId(kandidatliste);
        yield put({
            type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdSuccess,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield opprettKandidatlisteForStilling(stillingsId, e);
            } else {
                yield put({
                    type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdFailure,
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
        loggManglendeAktørId(kandidatliste);
        yield put({
            type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdSuccess,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdFailure,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* presenterKandidater(action: PresenterKandidaterAction) {
    try {
        const { beskjed, mailadresser, kandidatlisteId, kandidatnummerListe, navKontor } = action;
        const response = yield postDelteKandidater(
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe,
            navKontor
        );
        yield put({
            type: KandidatlisteActionType.PresenterKandidaterSuccess,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.PresenterKandidaterFailure, error: e });
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
            type: KandidatlisteActionType.EndreStatusKandidatSuccess,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.EndreStatusKandidatFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* endreKandidatUtfall(action: EndreUtfallKandidatAction) {
    try {
        const response: Kandidatliste = yield putUtfallKandidat(
            action.utfall,
            action.navKontor,
            action.kandidatlisteId,
            action.kandidatnr
        );
        yield put<EndreUtfallKandidatSuccessAction>({
            type: KandidatlisteActionType.EndreUtfallKandidatSuccess,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.EndreUtfallKandidatFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* endreUtfallForFormidlingAvUsynligKandidat(
    action: EndreFormidlingsutfallForUsynligKandidatAction
) {
    try {
        const response: Kandidatliste = yield putFormidlingsutfallForUsynligKandidat(
            action.kandidatlisteId,
            action.formidlingId,
            action.utfall,
            action.navKontor
        );

        yield put<EndreFormidlingsutfallForUsynligKandidatSuccessAction>({
            type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatSuccess,
            formidlingId: action.formidlingId,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatFailure,
                formidlingId: action.formidlingId,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* endreKandidatlistestatus(action: EndreKandidatlistestatusAction) {
    try {
        const kandidatliste: Kandidatliste = yield putKandidatlistestatus(
            action.kandidatlisteId,
            action.status
        );

        yield put<EndreKandidatlistestatusSuccessAction>({
            type: KandidatlisteActionType.EndreKandidatlistestatusSuccess,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.EndreKandidatlistestatusFailure,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* hentKandidatMedFnr(action: HentKandidatMedFnrAction) {
    try {
        const response: Nettressurs<Fødselsnummersøk> = yield fetchKandidatMedFnr(
            action.fodselsnummer
        );

        let data = response as NettressursMedForklaring<Fødselsnummersøk, Synlighetsevaluering>;

        if (response.kind === Nettstatus.FinnesIkke) {
            sendEvent('fødselsnummersøk', 'fant-ingen-kandidat', {
                kontekst: 'kandidatliste',
            });

            const response: NettressursMedForklaring<Fødselsnummersøk, Synlighetsevaluering> =
                yield fetchSynlighetsevaluering(action.fodselsnummer);

            data = response;

            yield put({
                type: KandidatlisteActionType.HentUsynligKandidat,
                fodselsnummer: action.fodselsnummer,
            });
        }

        yield put<HentKandidatMedFnrSuccessAction>({
            type: KandidatlisteActionType.HentKandidatMedFnrSuccess,
            data,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<HentKandidatMedFnrFailureAction>({
                type: KandidatlisteActionType.HentKandidatMedFnrFailure,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* hentUsynligKandidat(action: HentUsynligKandidatAction) {
    try {
        const response = yield fetchUsynligKandidat(action.fodselsnummer);
        yield put<KandidatlisteAction>({
            type: KandidatlisteActionType.HentUsynligKandidatSuccess,
            navn: response,
        });
    } catch (e) {
        yield put({
            type: KandidatlisteActionType.HentUsynligKandidatFailure,
            error: e,
        });
    }
}

function* leggTilKandidater(action: LeggTilKandidaterAction) {
    try {
        const response = yield postKandidaterTilKandidatliste(
            action.kandidatliste.kandidatlisteId,
            action.kandidater
        );
        yield put<KandidatlisteAction>({
            type: KandidatlisteActionType.LeggTilKandidaterSuccess,
            kandidatliste: response,
            antallLagredeKandidater: action.kandidater.length,
            lagretListe: action.kandidatliste,
            lagredeKandidater: action.kandidater,
        });
        yield put({ type: KandidatsøkActionType.Search });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.LeggTilKandidaterFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* lagreKandidatIKandidatliste(action) {
    try {
        yield call(leggTilKandidater, {
            type: KandidatlisteActionType.LeggTilKandidater,
            kandidatliste: action.kandidatliste,
            kandidater: [
                {
                    kandidatnr: action.kandidatnr,
                    notat: action.notat,
                },
            ],
        });

        yield put({ type: KandidatlisteActionType.LagreKandidatIKandidatlisteSuccess });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.LagreKandidatIKandidatlisteFailure,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* formidleUsynligKandidat(action: FormidleUsynligKandidatAction) {
    try {
        const response = yield postFormidlingerAvUsynligKandidat(
            action.kandidatlisteId,
            action.formidling
        );
        yield put({
            type: KandidatlisteActionType.FormidleUsynligKandidatSuccess,
            formidling: action.formidling,
            kandidatliste: response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: KandidatlisteActionType.FormidleUsynligKandidatFailure,
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
            type: KandidatlisteActionType.HentNotaterSuccess,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.HentNotaterFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* opprettNotat(action: OpprettNotatAction) {
    try {
        const response = yield postNotat(action.kandidatlisteId, action.kandidatnr, action.tekst);
        yield put({
            type: KandidatlisteActionType.OpprettNotatSuccess,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OpprettNotatFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedAnnonsenummer(action) {
    try {
        const kandidatliste = yield fetchKandidatlisteMedAnnonsenummer(action.annonsenummer);
        yield put({
            type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerSuccess,
            kandidatliste,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({
                    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerNotFound,
                    message: e.message,
                });
            } else {
                yield put({
                    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerFailure,
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
            type: KandidatlisteActionType.EndreNotatSuccess,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.EndreNotatFailure, error: e });
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
            type: KandidatlisteActionType.SlettNotatSuccess,
            notater: response.liste,
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.SlettNotatFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* toggleArkivert(action: ToggleArkivertAction) {
    try {
        const arkivertKandidat = yield putArkivert(
            action.kandidatlisteId,
            action.kandidatnr,
            action.arkivert
        );

        yield put<ToggleArkivertSuccessAction>({
            type: KandidatlisteActionType.ToggleArkivertSuccess,
            kandidat: arkivertKandidat,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.ToggleArkivertFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* angreArkiveringForKandidater(action: AngreArkiveringAction) {
    try {
        const kandidatnumre: Array<string | null> = yield call(
            putArkivertForFlereKandidater,
            action.kandidatlisteId,
            action.kandidatnumre,
            false
        );

        const dearkiverteKandidater = kandidatnumre.filter(
            (kandidatNr) => kandidatNr !== null
        ) as string[];

        yield put<AngreArkiveringSuccessAction>({
            type: KandidatlisteActionType.AngreArkiveringSuccess,
            kandidatnumre: dearkiverteKandidater,
        });
    } catch (e) {
        yield put({ type: KandidatlisteActionType.AngreArkiveringFailure });
    }
}

function* oppdaterKandidatliste(action) {
    try {
        yield putOppdaterKandidatliste(action.kandidatlisteInfo);
        yield put({
            type: KandidatlisteActionType.OppdaterKandidatlisteSuccess,
            tittel: action.kandidatlisteInfo.tittel,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.OppdaterKandidatlisteFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: KandidatsøkActionType.InvalidResponseStatus, error: action.error });
}

function* hentSendteMeldinger(action: HentSendteMeldingerAction) {
    try {
        const sendteMeldinger = yield call(fetchSendteMeldinger, action.kandidatlisteId);
        yield put({
            type: KandidatlisteActionType.HentSendteMeldingerSuccess,
            sendteMeldinger,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.HentSendteMeldingerFailure, error: e });
        } else {
            yield put({
                type: KandidatlisteActionType.HentSendteMeldingerFailure,
                error: {
                    message: 'Det skjedde noe galt',
                    status: 0,
                },
            });
        }
    }
}

function* hentForespørslerOmDelingAvCv(action: HentForespørslerOmDelingAvCvAction) {
    try {
        const forespørsler: ForespørslerForStillingInboundDto = yield call(
            fetchForespørslerOmDelingAvCv,
            action.stillingsId
        );

        yield put<KandidatlisteAction>({
            type: KandidatlisteActionType.HentForespørslerOmDelingAvCvSuccess,
            forespørslerOmDelingAvCv: forespørsler,
        });
    } catch (e) {
        yield put<KandidatlisteAction>({
            type: KandidatlisteActionType.HentForespørslerOmDelingAvCvFailure,
            error: e,
        });
    }
}

function* sendSmsTilKandidater(action: SendSmsAction) {
    try {
        yield call(postSmsTilKandidater, action.melding, action.fnr, action.kandidatlisteId);
        yield put({
            type: KandidatlisteActionType.SendSmsSuccess,
            kandidatlisteId: action.kandidatlisteId,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteActionType.SendSmsFailure, error: e });
        } else {
            yield put({
                type: KandidatlisteActionType.HentSendteMeldingerFailure,
                error: {
                    message: 'Det skjedde noe galt',
                    status: 0,
                },
            });
        }
    }
}

function* sendForespørselOmDeling(action: SendForespørselOmDelingAvCv) {
    try {
        const response: ForespørslerForStillingInboundDto = yield call(
            sendForespørselOmDelingAvCv,
            action.forespørselOutboundDto
        );

        yield put<KandidatlisteAction>({
            type: KandidatlisteActionType.SendForespørselOmDelingAvCvSuccess,
            forespørslerOmDelingAvCv: response,
        });
        sendEvent('forespørsel_deling_av_cv', 'sending', {
            stillingsId: action.forespørselOutboundDto.stillingsId,
            antallKandidater: action.forespørselOutboundDto.aktorIder.length,
        });
    } catch (e) {
        yield put({ type: KandidatlisteActionType.SendForespørselOmDelingAvCvFailure, error: e });
    }
}

function* kandidatlisteSaga() {
    yield takeLatest(KandidatlisteActionType.OpprettKandidatliste, opprettKandidatliste);
    yield takeLatest(
        KandidatlisteActionType.HentKandidatlisteMedStillingsId,
        hentKandidatlisteMedStillingsId
    );
    yield takeLatest(
        KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
        hentKandidatlisteMedKandidatlisteId
    );
    yield takeLatest(KandidatlisteActionType.PresenterKandidater, presenterKandidater);
    yield takeLatest(KandidatlisteActionType.EndreStatusKandidat, endreKandidatstatus);
    yield takeLatest(KandidatlisteActionType.EndreUtfallKandidat, endreKandidatUtfall);
    yield takeLatest(KandidatlisteActionType.HentKandidatMedFnr, hentKandidatMedFnr);
    yield takeLatest(KandidatlisteActionType.LeggTilKandidater, leggTilKandidater);
    yield takeLatest(KandidatlisteActionType.HentNotater, hentNotater);
    yield takeLatest(KandidatlisteActionType.OpprettNotat, opprettNotat);
    yield takeLatest(KandidatlisteActionType.EndreNotat, endreNotat);
    yield takeLatest(KandidatlisteActionType.SlettNotat, slettNotat);
    yield takeLatest(KandidatlisteActionType.ToggleArkivert, toggleArkivert);
    yield takeLatest(
        KandidatlisteActionType.HentKandidatlisteMedAnnonsenummer,
        hentKandidatlisteMedAnnonsenummer
    );
    yield takeLatest(
        KandidatlisteActionType.LagreKandidatIKandidatliste,
        lagreKandidatIKandidatliste
    );
    yield takeLatest(KandidatlisteActionType.FormidleUsynligKandidat, formidleUsynligKandidat);
    yield takeLatest(KandidatlisteActionType.OppdaterKandidatliste, oppdaterKandidatliste);
    yield takeLatest(KandidatlisteActionType.AngreArkivering, angreArkiveringForKandidater);
    yield takeLatest(
        [
            KandidatlisteActionType.OpprettKandidatlisteFailure,
            KandidatlisteActionType.HentKandidatlisteMedStillingsIdFailure,
            KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdFailure,
            KandidatlisteActionType.EndreStatusKandidatFailure,
            KandidatlisteActionType.PresenterKandidaterFailure,
            KandidatlisteActionType.HentKandidatMedFnrFailure,
            KandidatlisteActionType.LeggTilKandidaterFailure,
            KandidatlisteActionType.OpprettNotatFailure,
            KandidatlisteActionType.EndreNotatFailure,
            KandidatlisteActionType.ToggleArkivertFailure,
            KandidatlisteActionType.SlettNotatFailure,
            KandidatlisteActionType.LagreKandidatIKandidatlisteFailure,
        ],
        sjekkError
    );
    yield takeLatest(KandidatlisteActionType.SendSms, sendSmsTilKandidater);
    yield takeLatest(
        [KandidatlisteActionType.HentSendteMeldinger, KandidatlisteActionType.SendSmsSuccess],
        hentSendteMeldinger
    );
    yield takeLatest(KandidatlisteActionType.SendForespørselOmDelingAvCv, sendForespørselOmDeling);
    yield takeLatest(
        [KandidatlisteActionType.HentForespørslerOmDelingAvCv],
        hentForespørslerOmDelingAvCv
    );
    yield takeLatest(KandidatlisteActionType.HentUsynligKandidat, hentUsynligKandidat);
    yield takeLatest(
        KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidat,
        endreUtfallForFormidlingAvUsynligKandidat
    );
    yield takeLatest(KandidatlisteActionType.EndreKandidatlistestatus, endreKandidatlistestatus);
}

export default kandidatlisteSaga;
