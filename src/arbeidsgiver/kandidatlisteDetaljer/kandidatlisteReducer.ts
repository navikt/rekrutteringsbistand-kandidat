import { call, put, takeLatest } from 'redux-saga/effects';
import {
    deleteKandidater,
    deleteNotat,
    fetchKandidatliste,
    fetchNotater,
    postNotat,
    putNotat,
    SearchApiError
} from '../sok/api';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import { Reducer } from 'redux';
import { Kandidat } from '../../veileder/kandidatlister/PropTypes';
import {
    NotAsked,
    Loading,
    Success,
    mapRemoteData,
    mapResponseData,
    RemoteData,
    RemoteDataTypes,
    ResponseData
} from '../../felles/common/remoteData';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export enum KandidatlisteTypes {
    HENT_KANDIDATLISTE = 'HENT_KANDIDATLISTE',
    HENT_KANDIDATLISTE_FERDIG = 'HENT_KANDIDATLISTE_FERDIG',
    CLEAR_KANDIDATLISTE = 'CLEAR_KANDIDATLISTE',
    SLETT_KANDIDATER = 'SLETT_KANDIDATER',
    SLETT_KANDIDATER_FERDIG = 'SLETT_KANDIDATER_FERDIG',
    SLETT_KANDIDATER_RESET_STATUS = 'SLETT_KANDIDATER_RESET_STATUS',
    HENT_NOTATER = 'HENT_NOTATER',
    HENT_NOTATER_FERDIG = 'HENT_NOTATER_FERDIG',
    OPPRETT_NOTAT = 'OPPRETT_NOTAT',
    OPPRETT_NOTAT_FERDIG = 'OPPRETT_NOTAT_FERDIG',
    REDIGER_NOTAT = 'REDIGER_NOTAT',
    REDIGER_NOTAT_FERDIG = 'REDIGER_NOTAT_FERDIG',
    SLETT_NOTAT = 'SLETT_NOTAT',
    SLETT_NOTAT_FERDIG = 'SLETT_NOTAT_FERDIG',
    RESET_ENDRE_NOTAT_STATE = 'RESET_ENDRE_NOTAT_STATE',
    UPDATE_KANDIDATLISTE_VIEW_STATE = 'UPDATE_KANDIDATLISTE_VIEW_STATE'
}

interface HentKandidatlisteAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE;
    kandidatlisteId: string;
}

interface HentKandidatlisteFerdigAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_FERDIG;
    kandidatliste: ResponseData<KandidatlisteDetaljerResponse>
}

interface ClearKandidatlisteAction {
    type: KandidatlisteTypes.CLEAR_KANDIDATLISTE;
}

interface SlettKandidaterAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER;
    kandidater: Array<Kandidat>
    kandidatlisteId: string
}

interface SlettKandidaterFerdigAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER_FERDIG;
    kandidatliste: ResponseData<KandidatlisteDetaljerResponse>;
    antallKandidaterSlettet: number;
}

interface SlettKandidaterResetStatusAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS;
}

interface HentNotaterAction {
    type: KandidatlisteTypes.HENT_NOTATER;
    kandidatlisteId: string;
    kandidatnr: string;
}

interface HentNotaterFerdigAction {
    type: KandidatlisteTypes.HENT_NOTATER_FERDIG;
    notater: ResponseData<Array<Notat>>,
    kandidatnr: string
}

interface OpprettNotatAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    tekst: string
}

interface OpprettNotatFerdigAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT_FERDIG;
    notater: ResponseData<Array<Notat>>
    kandidatnr: string
}

interface RedigerNotatAction {
    type: KandidatlisteTypes.REDIGER_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    notat: Notat
    tekst: string
}

interface RedigerNotatFerdigAction {
    type: KandidatlisteTypes.REDIGER_NOTAT_FERDIG;
    notater: ResponseData<Array<Notat>>
    kandidatnr: string
}

interface SlettNotatAction {
    type: KandidatlisteTypes.SLETT_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    notat: Notat
}

interface SlettNotatFerdigAction {
    type: KandidatlisteTypes.SLETT_NOTAT_FERDIG;
    notater: ResponseData<Array<Notat>>
    kandidatnr: string
}

export enum UpdateKandidatIListeStateTypes {
    KANDIDAT_TOGGLE_CHECKED = 'KANDIDAT_TOGGLE_CHECKED',
    KANDIDAT_SET_VIEW_STATE = 'KANDIDAT_SET_VIEW_STATE',
    SET_ALL_CHECKED = 'SET_ALL_CHECKED'
}

interface KandidatToggleChecked {
    type: UpdateKandidatIListeStateTypes.KANDIDAT_TOGGLE_CHECKED,
    kandidatnr: string
}

interface KandidatSetViewState {
    type: UpdateKandidatIListeStateTypes.KANDIDAT_SET_VIEW_STATE,
    kandidatnr: string,
    state: KandidatState
}

interface SetAllChecked {
    type: UpdateKandidatIListeStateTypes.SET_ALL_CHECKED,
    checked: boolean
}

type UpdateKandidatIListeState = KandidatToggleChecked | KandidatSetViewState | SetAllChecked;


interface UpdateKandidatlisteViewStateAction {
    type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE,
    change: UpdateKandidatIListeState
}

export enum EndreType {
    OPPRETT = 'OPPRETT',
    REDIGER = 'REDIGER',
    SLETT = 'SLETT'
}

interface ResetEndreNotatStateAction {
    type: KandidatlisteTypes.RESET_ENDRE_NOTAT_STATE,
    endreType: EndreType,
    kandidatnr: string
}

type KandidatlisteAction =
    | HentKandidatlisteAction
    | HentKandidatlisteFerdigAction
    | ClearKandidatlisteAction
    | SlettKandidaterAction
    | SlettKandidaterFerdigAction
    | SlettKandidaterResetStatusAction
    | HentNotaterAction
    | HentNotaterFerdigAction
    | OpprettNotatAction
    | OpprettNotatFerdigAction
    | RedigerNotatAction
    | RedigerNotatFerdigAction
    | SlettNotatAction
    | SlettNotatFerdigAction
    | UpdateKandidatlisteViewStateAction
    | ResetEndreNotatStateAction

/** *********************************************************
 * REDUCER
 ********************************************************* */

interface KandidatlisteState {
    sletteStatus: RemoteData<{ antallKandidaterSlettet: number }>;
    kandidatliste: RemoteData<KandidatlisteDetaljer>;
}

export interface KandidatResponse {
    lagtTilAv: string;
    kandidatnr: string;
    sisteArbeidserfaring: string;
    fornavn: string;
    etternavn: string;
    erSynlig: boolean;
    antallNotater: number;
}

export interface Notat {
    notatId: string
    tekst: string
    lagtTilTidspunkt: string
    sistEndretTidspunkt: string
    notatEndret: boolean
}

export interface Notater {
    notater: RemoteData<Array<Notat>>,
    opprettState: RemoteData<any>,
    redigerState: RemoteData<any>,
    slettState: RemoteData<any>
}

export enum KandidatState {
    LUKKET = 'LUKKET',
    NOTATER_VISES = 'NOTATER_VISES'
}

interface KandidatExtension {
    notater: Notater,
    checked: boolean,
    viewState: KandidatState
}

export interface KandidatlisteDetaljerBase {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse?: string;
    organisasjonNavn?: string;
    oppdragsgiver?: string;
}

interface KandidatlisteDetaljerResponseExtension {
    kandidater: Array<KandidatResponse>;
}

export type Kandidat = KandidatResponse & KandidatExtension;

interface KandidatlisteDetaljerExtension {
    allChecked: boolean;
    kandidater: Array<Kandidat>;
}

export type KandidatlisteDetaljerResponse = KandidatlisteDetaljerBase & KandidatlisteDetaljerResponseExtension;

export type KandidatlisteDetaljer = KandidatlisteDetaljerBase & KandidatlisteDetaljerExtension;

const initialState: KandidatlisteState = {
    sletteStatus: NotAsked(),
    kandidatliste: NotAsked()
};

const overforGammelKandidatlisteState: (forrigeListe: KandidatlisteDetaljer, kandidatliste: KandidatlisteDetaljerResponse) => KandidatlisteDetaljer = (forrigeListe, kandidatliste) => {
    const kandidaterState: { [index: string]: KandidatExtension } = forrigeListe.kandidater.reduce((dict, kandidat) => ({
        ...dict,
        [kandidat.kandidatnr]: {
            notater: kandidat.notater,
            checked: kandidat.checked,
            viewState: kandidat.viewState
        }
    }), {});
    const kandidater = kandidatliste.kandidater.map((kandidat) => {
        if (kandidaterState[kandidat.kandidatnr]) {
            return {
                ...kandidat,
                ...(kandidaterState[kandidat.kandidatnr])
            };
        }
        return {
            ...kandidat,
            ...initKandidatFelter(forrigeListe.allChecked)
        };
    });
    return {
        ...kandidatliste,
        allChecked: forrigeListe.allChecked && kandidater.filter(kandidat => kandidat.checked).length === kandidater.length && kandidater.length > 0,
        kandidater: kandidater
    };
};

const initKandidatFelter: (checked?: boolean) => KandidatExtension = (checked = false) => ({
    notater: {
        notater: NotAsked(),
        opprettState: NotAsked(),
        redigerState: NotAsked(),
        slettState: NotAsked()
    },
    checked: checked,
    viewState: KandidatState.LUKKET
});

const initKandidatlisteState: (kandidatliste: KandidatlisteDetaljerResponse) => KandidatlisteDetaljer = (kandidatliste) => ({
    ...kandidatliste,
    allChecked: false,
    kandidater: kandidatliste.kandidater.map((kandidat) => ({
        ...kandidat,
        ...initKandidatFelter()
    }))
});

const overforKandidatlisteDetaljerState: (forrigeListe: RemoteData<KandidatlisteDetaljer>, kandidatliste: ResponseData<KandidatlisteDetaljerResponse>) => RemoteData<KandidatlisteDetaljer> = (forrigeListe, kandidatliste) => {
    if (forrigeListe.kind === RemoteDataTypes.SUCCESS && kandidatliste.kind === RemoteDataTypes.SUCCESS && forrigeListe.data.kandidatlisteId === kandidatliste.data.kandidatlisteId) {
        return Success(overforGammelKandidatlisteState(forrigeListe.data, kandidatliste.data));
    } else if (kandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return Success(initKandidatlisteState(kandidatliste.data));
    }
    return kandidatliste;
};

const updateKandidatState: (kandidatliste: RemoteData<KandidatlisteDetaljer>, change: UpdateKandidatIListeState) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, change) => {
    if (kandidatliste.kind !== RemoteDataTypes.SUCCESS) {
        return kandidatliste;
    }
    const kandidater = kandidatliste.data.kandidater.map((kandidat) => {
        if (change.type === UpdateKandidatIListeStateTypes.KANDIDAT_SET_VIEW_STATE) {
            if (kandidat.kandidatnr === change.kandidatnr) {
                return {
                    ...kandidat,
                    viewState: change.state
                };
            } else {
                return {
                    ...kandidat,
                    viewState: KandidatState.LUKKET
                };
            }
        } else if (change.type === UpdateKandidatIListeStateTypes.KANDIDAT_TOGGLE_CHECKED && kandidat.kandidatnr === change.kandidatnr) {
            return {
                ...kandidat,
                checked: !kandidat.checked
            };
        } else if (change.type === UpdateKandidatIListeStateTypes.SET_ALL_CHECKED) {
            return {
                ...kandidat,
                checked: change.checked
            };
        }
        return kandidat;
    });
    const allChecked = () => {
        if (kandidater.filter((kandidat) => !kandidat.checked).length !== 0 && kandidater.length > 0) {
            return false;
        } else if (change.type === UpdateKandidatIListeStateTypes.SET_ALL_CHECKED) {
            return change.checked
        }
        return kandidatliste.data.allChecked;
    };
    return Success({
        ...kandidatliste.data,
        allChecked: allChecked(),
        kandidater
    });
};

const mapNotaterForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, transform: (Notater) => Notater) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, transform) => {
    if (kandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return Success({
            ...kandidatliste.data,
            kandidater: kandidatliste.data.kandidater.map((kandidat) => {
                const notater = transform(kandidat.notater);
                if (kandidat.kandidatnr === kandidatnr) {
                    return {
                        ...kandidat,
                        antallNotater: notater.notater.kind === RemoteDataTypes.SUCCESS ? notater.notater.data.length : kandidat.antallNotater,
                        notater
                    }
                }
                return kandidat;
            })
        })
    }
    return kandidatliste;
};

const setNotaterForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, notatliste: RemoteData<Array<Notat>>) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, notatliste) => (
    mapNotaterForKandidat(kandidatliste, kandidatnr, (notater: Notater) => ({
        ...notater,
        notater: notatliste
    }))
);

const oppdaterOpprettNotatStateForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, remoteData: RemoteData<Array<Notat>>) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, remoteData) => (
    mapNotaterForKandidat(kandidatliste, kandidatnr, (notater: Notater) => ({
        ...notater,
        opprettState: remoteData,
        notater: remoteData.kind === RemoteDataTypes.SUCCESS ? remoteData : notater.notater
    }))
);

const oppdaterRedigerNotatStateForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, remoteData: RemoteData<Array<Notat>>) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, remoteData) => (
    mapNotaterForKandidat(kandidatliste, kandidatnr, (notater: Notater) => ({
        ...notater,
        redigerState: remoteData,
        notater: remoteData.kind === RemoteDataTypes.SUCCESS ? remoteData : notater.notater
    }))
);

const oppdaterSlettNotatStateForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, remoteData: RemoteData<Array<Notat>>) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, remoteData) => (
    mapNotaterForKandidat(kandidatliste, kandidatnr, (notater: Notater) => ({
        ...notater,
        slettState: remoteData,
        notater: remoteData.kind === RemoteDataTypes.SUCCESS ? remoteData : notater.notater
    }))
);

const resetEndreNotatStateForKandidat: (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, endreType: EndreType) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, endreType) => {
    switch (endreType) {
        case EndreType.OPPRETT:
            return oppdaterOpprettNotatStateForKandidat(kandidatliste, kandidatnr, NotAsked());

        case EndreType.REDIGER:
            return oppdaterRedigerNotatStateForKandidat(kandidatliste, kandidatnr, NotAsked());

        case EndreType.SLETT:
            return oppdaterSlettNotatStateForKandidat(kandidatliste, kandidatnr, NotAsked());
    }
    return kandidatliste;
};

const kandidatlisteReducer: Reducer<KandidatlisteState, KandidatlisteAction> = (state = initialState, action) => {
    switch (action.type) {
        case KandidatlisteTypes.HENT_KANDIDATLISTE:
            return {
                ...state,
                kandidatliste: Loading()
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_FERDIG:
            return {
                ...state,
                kandidatliste: overforKandidatlisteDetaljerState(state.kandidatliste, action.kandidatliste)
            };
        case KandidatlisteTypes.CLEAR_KANDIDATLISTE:
            return initialState;

        case KandidatlisteTypes.SLETT_KANDIDATER:
            return {
                ...state,
                sletteStatus: Loading()
            };
        case KandidatlisteTypes.SLETT_KANDIDATER_FERDIG:
            console.log({ action });
            return {
                ...state,
                kandidatliste: overforKandidatlisteDetaljerState(state.kandidatliste, action.kandidatliste),
                sletteStatus: mapResponseData(action.kandidatliste, () => ({ antallKandidaterSlettet: action.antallKandidaterSlettet }))
            };
        case KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS:
            return {
                ...state,
                sletteStatus: NotAsked()
            };
        case KandidatlisteTypes.HENT_NOTATER:
            return {
                ...state,
                kandidatliste: setNotaterForKandidat(state.kandidatliste, action.kandidatnr, Loading())
            };
        case KandidatlisteTypes.HENT_NOTATER_FERDIG:
            return {
                ...state,
                kandidatliste: setNotaterForKandidat(state.kandidatliste, action.kandidatnr, action.notater)
            };
        case KandidatlisteTypes.OPPRETT_NOTAT:
            return {
                ...state,
                kandidatliste: oppdaterOpprettNotatStateForKandidat(state.kandidatliste, action.kandidatnr, Loading())
            };
        case KandidatlisteTypes.OPPRETT_NOTAT_FERDIG:
            return {
                ...state,
                kandidatliste: oppdaterOpprettNotatStateForKandidat(state.kandidatliste, action.kandidatnr, action.notater)
            };
        case KandidatlisteTypes.REDIGER_NOTAT:
            return {
                ...state,
                kandidatliste: oppdaterRedigerNotatStateForKandidat(state.kandidatliste, action.kandidatnr, Loading())
            };
        case KandidatlisteTypes.REDIGER_NOTAT_FERDIG:
            return {
                ...state,
                kandidatliste: oppdaterRedigerNotatStateForKandidat(state.kandidatliste, action.kandidatnr, action.notater)
            };
        case KandidatlisteTypes.SLETT_NOTAT:
            return {
                ...state,
                kandidatliste: oppdaterSlettNotatStateForKandidat(state.kandidatliste, action.kandidatnr, Loading())
            };
        case KandidatlisteTypes.SLETT_NOTAT_FERDIG:
            return {
                ...state,
                kandidatliste: oppdaterSlettNotatStateForKandidat(state.kandidatliste, action.kandidatnr, action.notater)
            };
        case KandidatlisteTypes.RESET_ENDRE_NOTAT_STATE:
            return {
                ...state,
                kandidatliste: resetEndreNotatStateForKandidat(state.kandidatliste, action.kandidatnr, action.endreType)
            };
        case KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE:
            return {
                ...state,
                kandidatliste: updateKandidatState(state.kandidatliste, action.change)
            };
        default:
            return state;
    }
};

export default kandidatlisteReducer;

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* hentKandidatListe(action: HentKandidatlisteAction) {
    const response = yield call(fetchKandidatliste, action.kandidatlisteId);
    yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTE_FERDIG, kandidatliste: response });
}

function* slettKandidater(action: SlettKandidaterAction) {
    const { kandidater, kandidatlisteId } = action;
    const slettKandidatnr = kandidater.map((k) => k.kandidatnr);
    const response = yield call(deleteKandidater, kandidatlisteId, slettKandidatnr);
    yield put({ type: KandidatlisteTypes.SLETT_KANDIDATER_FERDIG, kandidatliste: response, antallKandidaterSlettet: kandidater.length });
}

function* hentNotater(action: HentNotaterAction) {
    const response = yield call(fetchNotater, action.kandidatlisteId, action.kandidatnr);
    yield put({ type: KandidatlisteTypes.HENT_NOTATER_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* opprettNotat(action: OpprettNotatAction) {
    const response = yield call(postNotat, action.kandidatlisteId, action.kandidatnr, action.tekst);
    yield put({ type: KandidatlisteTypes.OPPRETT_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* redigerNotat(action: RedigerNotatAction) {
    const response = yield call(putNotat, action.kandidatlisteId, action.kandidatnr, action.notat, action.tekst);
    yield put({ type: KandidatlisteTypes.REDIGER_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* slettNotat(action: SlettNotatAction) {
    const response = yield call(deleteNotat, action.kandidatlisteId, action.kandidatnr, action.notat);
    yield put({ type: KandidatlisteTypes.SLETT_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* putGenerellErrorVed401(remoteData: ResponseData<any>) {
    if (remoteData.kind === RemoteDataTypes.FAILURE && remoteData.error.status === 401) {
        yield put({ type: INVALID_RESPONSE_STATUS, error: remoteData.error });
    }
}

type ApiKallFerdigAction =
    | HentKandidatlisteFerdigAction
    | SlettKandidaterFerdigAction
    | HentNotaterFerdigAction
    | OpprettNotatFerdigAction
    | RedigerNotatFerdigAction
    | SlettNotatFerdigAction

function* sjekkError(action: ApiKallFerdigAction) {
    switch (action.type) {
        case KandidatlisteTypes.HENT_KANDIDATLISTE_FERDIG:
        case KandidatlisteTypes.SLETT_KANDIDATER_FERDIG:
            yield putGenerellErrorVed401(action.kandidatliste);
            break;

        case KandidatlisteTypes.HENT_NOTATER_FERDIG:
        case KandidatlisteTypes.OPPRETT_NOTAT_FERDIG:
        case KandidatlisteTypes.REDIGER_NOTAT_FERDIG:
        case KandidatlisteTypes.SLETT_NOTAT_FERDIG:
            yield putGenerellErrorVed401(action.notater);
            break;
    }
}

export function* kandidatlisteDetaljerSaga() {
    yield takeLatest(KandidatlisteTypes.HENT_KANDIDATLISTE, hentKandidatListe);
    yield takeLatest(KandidatlisteTypes.SLETT_KANDIDATER, slettKandidater);
    yield takeLatest(KandidatlisteTypes.HENT_NOTATER, hentNotater);
    yield takeLatest(KandidatlisteTypes.OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(KandidatlisteTypes.REDIGER_NOTAT, redigerNotat);
    yield takeLatest(KandidatlisteTypes.SLETT_NOTAT, slettNotat);
    yield takeLatest([
            KandidatlisteTypes.HENT_KANDIDATLISTE_FERDIG,
            KandidatlisteTypes.SLETT_KANDIDATER_FERDIG,
            KandidatlisteTypes.HENT_NOTATER_FERDIG,
            KandidatlisteTypes.OPPRETT_NOTAT_FERDIG,
            KandidatlisteTypes.REDIGER_NOTAT_FERDIG,
            KandidatlisteTypes.SLETT_NOTAT_FERDIG
        ], sjekkError
    )
}
