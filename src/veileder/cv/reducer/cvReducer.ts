import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCv } from '../../api';
import { INVALID_RESPONSE_STATUS } from '../../sok/searchReducer';
import { SearchApiError } from '../../../felles/api';
import { Tilgjengelighet } from '../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';

export enum CvActionType {
    FETCH_CV = 'FETCH_CV',
    FETCH_CV_BEGIN = 'FETCH_CV_BEGIN',
    FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS',
    FETCH_CV_NOT_FOUND = 'FETCH_CV_NOT_FOUND',
    FETCH_CV_FAILURE = 'FETCH_CV_FAILURE',
}

export type FetchCvAction = {
    type: CvActionType.FETCH_CV;
    arenaKandidatnr: string;
    profilId?: string; // Er denne depracated? Brukes ikke i API.
};

export type FetchCvBeginAction = {
    type: CvActionType.FETCH_CV_BEGIN;
};

export type FetchCvSuccessAction = {
    type: CvActionType.FETCH_CV_SUCCESS;
    response: Cv;
};

export type FetchCvNotFoundAction = {
    type: CvActionType.FETCH_CV_NOT_FOUND;
};

export type FetchCvFailureAction = {
    type: CvActionType.FETCH_CV_FAILURE;
};

export type CvAction =
    | FetchCvAction
    | FetchCvBeginAction
    | FetchCvSuccessAction
    | FetchCvNotFoundAction
    | FetchCvFailureAction;

export enum HentCvStatus {
    IkkeHentet = 'IKKE_HENTET',
    Loading = 'LOADING',
    Success = 'SUCCESS',
    FinnesIkke = 'FINNES_IKKE',
}

export type Cv = {
    aktorId: string;
    kandidatnummer: string;

    utdanning: any[];
    yrkeserfaring: any[];
    kurs: any[];
    sertifikater: any[];
    sprak: any[];

    adresselinje1: string;
    adresselinje2: string;
    adresselinje3: string;
    annenerfaring: any[];
    ansettelsesforholdJobbonsker: any[];
    arbeidstidsordningJobbonsker: any[];
    arenaKandidatnr: string;
    arenaPersonId: number;
    profilId: string;
    beskrivelse: string;
    disponererBil: boolean;
    epostadresse: string;
    mobiltelefon: string;
    telefon: string;
    etternavn: string;
    fodselsdato: string;
    fodselsdatoErDnr: boolean;
    fodselsnummer: string;
    forerkort: any[];
    formidlingsgruppekode: string;
    fornavn: string;
    geografiJobbonsker: any[];
    heltidDeltidJobbonsker: any[];
    kommunenummer: number;
    kompetanse: any[];
    landkode: string;
    postnummer: string;
    poststed: string;
    samletKompetanse: any[];
    samtykkeDato: string;
    samtykkeStatus: string;
    sertifikat: any[];
    servicebehov: string;
    statsborgerskap: string;
    tidsstempel: string;
    totalLengdeYrkeserfaring: number;
    fagdokumentasjon: any[];
    verv: any[];
    yrkeJobbonsker: any[];
    midlertidigUtilgjengeligStatus: Tilgjengelighet;
    erLagtTilKandidatliste: boolean;
};

export type CvState = {
    cv: Cv;
    hentStatus: HentCvStatus;
};

const initialState: any = {
    cv: {
        aktorId: '',
        kandidatnummer: '',

        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikater: [],
        sprak: [],
    },
    hentStatus: HentCvStatus.IkkeHentet,
};

export default function cvReducer(state: CvState = initialState, action: CvAction) {
    switch (action.type) {
        case CvActionType.FETCH_CV:
            return {
                ...state,
                hentStatus: HentCvStatus.Loading,
            };
        case CvActionType.FETCH_CV_SUCCESS:
            return {
                ...state,
                cv: action.response,
                hentStatus: HentCvStatus.Success,
            };
        case CvActionType.FETCH_CV_NOT_FOUND:
            return {
                ...state,
                hentStatus: HentCvStatus.FinnesIkke,
            };
        default:
            return state;
    }
}

function* fetchCvForKandidat(action: FetchCvAction) {
    try {
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });
        yield put({ type: CvActionType.FETCH_CV_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: CvActionType.FETCH_CV_NOT_FOUND });
            } else {
                yield put({ type: CvActionType.FETCH_CV_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* dispatchGenerellErrorAction(action: any) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(CvActionType.FETCH_CV, fetchCvForKandidat);
    yield takeLatest(CvActionType.FETCH_CV_FAILURE, dispatchGenerellErrorAction);
};
