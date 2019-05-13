import { put, takeLatest } from 'redux-saga/effects';
import {
    deleteKandidater,
    deleteNotat,
    fetchKandidatliste,
    fetchNotater,
    postNotat,
    putNotat,
    SearchApiError
} from '../sok/api';
import { SLETTE_STATUS } from '../../felles/konstanter';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import { Reducer } from 'redux';
import { Kandidat } from '../../veileder/kandidatlister/PropTypes';
import {
    Loading,
    mapRemoteData,
    NotAsked,
    RemoteData,
    RemoteDataTypes,
    ResponseData,
    Success
} from '../../felles/common/remoteData';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export enum KandidatlisteTypes {
    HENT_KANDIDATLISTE = 'HENT_KANDIDATLISTE',
    HENT_KANDIDATLISTE_SUCCESS = 'HENT_KANDIDATLISTE_SUCCESS',
    HENT_KANDIDATLISTE_FAILURE = 'HENT_KANDIDATLISTE_FAILURE',
    CLEAR_KANDIDATLISTE = 'CLEAR_KANDIDATLISTE',
    SLETT_KANDIDATER = 'SLETT_KANDIDATER',
    SLETT_KANDIDATER_SUCCESS = 'SLETT_KANDIDATER_SUCCESS',
    SLETT_KANDIDATER_FAILURE = 'SLETT_KANDIDATER_FAILURE',
    SLETT_KANDIDATER_RESET_STATUS = 'SLETT_KANDIDATER_RESET_STATUS',
    HENT_NOTATER = 'HENT_NOTATER',
    HENT_NOTATER_FERDIG = 'HENT_NOTATER_FERDIG',
    OPPRETT_NOTAT = 'OPPRETT_NOTAT',
    OPPRETT_NOTAT_FERDIG = 'OPPRETT_NOTAT_FERDIG',
    REDIGER_NOTAT = 'REDIGER_NOTAT',
    REDIGER_NOTAT_FERDIG = 'REDIGER_NOTAT_FERDIG',
    SLETT_NOTAT = 'SLETT_NOTAT',
    SLETT_NOTAT_FERDIG = 'SLETT_NOTAT_FERDIG',
    UPDATE_KANDIDATLISTE_VIEW_STATE = 'UPDATE_KANDIDATLISTE_VIEW_STATE'
}

export interface HentKandidatlisteAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE;
    kandidatlisteId: string;
}

export interface HentKandidatlisteSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_SUCCESS;
    kandidatliste: KandidatlisteDetaljerResponse
}

export interface HentKandidatlisteFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_FAILURE;
}

export interface ClearKandidatlisteAction {
    type: KandidatlisteTypes.CLEAR_KANDIDATLISTE;
}

export interface SlettKandidaterAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER;
    kandidater: Array<Kandidat>
    kandidatlisteId: string
}

export interface SlettKandidaterSuccessAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER_SUCCESS;
    nyKandidatliste: KandidatlisteDetaljerResponse
}

export interface SlettKandidaterFailureAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER_FAILURE;
}

export interface SlettKandidaterResetStatusAction {
    type: KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS;
}

export interface HentNotaterAction {
    type: KandidatlisteTypes.HENT_NOTATER;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface HentNotaterFerdigAction {
    type: KandidatlisteTypes.HENT_NOTATER_FERDIG;
    notater: ResponseData<Array<Notat>>,
    kandidatnr: string
}

export interface OpprettNotatAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    tekst: string
}

export interface OpprettNotatFerdigAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT_FERDIG;
    notater: ResponseData<Array<Notat>>
    kandidatnr: string
}

export interface RedigerNotatAction {
    type: KandidatlisteTypes.REDIGER_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    notat: Notat
    tekst: string
}

export interface RedigerNotatFerdigAction {
    type: KandidatlisteTypes.REDIGER_NOTAT_FERDIG;
    notater: ResponseData<Array<Notat>>
    kandidatnr: string
}

export interface SlettNotatAction {
    type: KandidatlisteTypes.SLETT_NOTAT;
    kandidatlisteId: string
    kandidatnr: string
    notat: Notat
}

export interface SlettNotatFerdigAction {
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


export interface UpdateKandidatlisteViewStateAction {
    type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE,
    change: UpdateKandidatIListeState
}

export enum EndreType {
    OPPRETT = 'OPPRETT',
    REDIGER = 'REDIGER',
    SLETT = 'SLETT'
}

export type KandidatlisteAction =
    | HentKandidatlisteSuccessAction
    | HentKandidatlisteFailureAction
    | ClearKandidatlisteAction
    | SlettKandidaterAction
    | SlettKandidaterSuccessAction
    | SlettKandidaterFailureAction
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

/** *********************************************************
 * REDUCER
 ********************************************************* */

interface KandidatlisteState {
    sletteStatus: string;
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

type KandidatlisteDetaljerResponse = KandidatlisteDetaljerBase & KandidatlisteDetaljerResponseExtension;

export type KandidatlisteDetaljer = KandidatlisteDetaljerBase & KandidatlisteDetaljerExtension;

const initialState: KandidatlisteState = {
    sletteStatus: SLETTE_STATUS.FINISHED,
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
    return {
        ...kandidatliste,
        allChecked: forrigeListe.allChecked,
        kandidater: kandidatliste.kandidater.map((kandidat) => {
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
        })
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


const overforKandidatlisteDetaljerState: (forrigeListe: RemoteData<KandidatlisteDetaljer>, kandidatliste: KandidatlisteDetaljerResponse) => KandidatlisteDetaljer = (forrigeListe, kandidatliste) => {
    if (forrigeListe.kind === RemoteDataTypes.SUCCESS) {
        return overforGammelKandidatlisteState(forrigeListe.data, kandidatliste);
    }
    return initKandidatlisteState(kandidatliste);
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
        if (kandidater.filter((kandidat) => !kandidat.checked).length !== 0) {
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

const mapNotaterForKandidat : (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, transform: (Notater) => Notater) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, transform) => {
    if (kandidatliste.kind === RemoteDataTypes.SUCCESS) {
        return Success({
            ...kandidatliste.data,
            kandidater: kandidatliste.data.kandidater.map((kandidat) => {
                if (kandidat.kandidatnr === kandidatnr) {
                    return {
                        ...kandidat,
                        notater: transform(kandidat.notater)
                    }
                }
                return kandidat;
            })
        })
    }
    return kandidatliste;
};

const setNotaterForKandidat : (kandidatliste: RemoteData<KandidatlisteDetaljer>, kandidatnr: string, notatliste: RemoteData<Array<Notat>>) => RemoteData<KandidatlisteDetaljer> = (kandidatliste, kandidatnr, notatliste) => (
    mapNotaterForKandidat(kandidatliste, kandidatnr, (notater : Notater) => ({
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

const kandidatlisteReducer: Reducer<KandidatlisteState, KandidatlisteAction> = (state = initialState, action) => {
    switch (action.type) {
        case KandidatlisteTypes.HENT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                kandidatliste: Success(overforKandidatlisteDetaljerState(state.kandidatliste, action.kandidatliste))
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                sletteStatus: SLETTE_STATUS.FAILURE

            };
        case KandidatlisteTypes.CLEAR_KANDIDATLISTE:
            return initialState;

        case KandidatlisteTypes.SLETT_KANDIDATER: {
            return {
                ...state,
                sletteStatus: SLETTE_STATUS.LOADING
            };
        }
        case KandidatlisteTypes.SLETT_KANDIDATER_SUCCESS: {
            const { nyKandidatliste } = action;
            return {
                ...state,
                kandidatliste: Success(overforKandidatlisteDetaljerState(state.kandidatliste, nyKandidatliste)),
                sletteStatus: SLETTE_STATUS.SUCCESS
            };
        }
        case KandidatlisteTypes.SLETT_KANDIDATER_FAILURE:
            return {
                ...state,
                sletteStatus: SLETTE_STATUS.FAILURE
            };
        case KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS:
            return {
                ...state,
                sletteStatus: SLETTE_STATUS.FINISHED
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
    const { kandidatlisteId } = action;
    try {
        const kandidatliste = yield fetchKandidatliste(kandidatlisteId);
        yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTE_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidater(action: SlettKandidaterAction) {
    try {
        const { kandidater, kandidatlisteId } = action;
        const slettKandidatnr = kandidater.map((k) => k.kandidatnr);
        const response = yield deleteKandidater(kandidatlisteId, slettKandidatnr);
        yield put({ type: KandidatlisteTypes.SLETT_KANDIDATER_SUCCESS, nyKandidatliste: response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.SLETT_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentNotater(action: HentNotaterAction) {
    const response = yield fetchNotater(action.kandidatlisteId, action.kandidatnr);
    yield put({ type: KandidatlisteTypes.HENT_NOTATER_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* opprettNotat(action: OpprettNotatAction) {
    const response = yield postNotat(action.kandidatlisteId, action.kandidatnr, action.tekst);
    yield put({ type: KandidatlisteTypes.OPPRETT_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* redigerNotat(action: RedigerNotatAction) {
    const response = yield putNotat(action.kandidatlisteId, action.kandidatnr, action.notat, action.tekst);
    yield put({ type: KandidatlisteTypes.REDIGER_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* slettNotat(action: SlettNotatAction) {
    const response = yield deleteNotat(action.kandidatlisteId, action.kandidatnr, action.notat);
    yield put({ type: KandidatlisteTypes.SLETT_NOTAT_FERDIG, notater: mapRemoteData(response, ({ liste }) => liste), kandidatnr: action.kandidatnr });
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export function* kandidatlisteDetaljerSaga() {
    yield takeLatest(KandidatlisteTypes.HENT_KANDIDATLISTE, hentKandidatListe);
    yield takeLatest(KandidatlisteTypes.SLETT_KANDIDATER, slettKandidater);
    yield takeLatest(KandidatlisteTypes.HENT_NOTATER, hentNotater);
    yield takeLatest(KandidatlisteTypes.OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(KandidatlisteTypes.REDIGER_NOTAT, redigerNotat);
    yield takeLatest(KandidatlisteTypes.SLETT_NOTAT, slettNotat);
    yield takeLatest([
            KandidatlisteTypes.HENT_KANDIDATLISTE_FAILURE,
            KandidatlisteTypes.SLETT_KANDIDATER_FAILURE
        ],
        sjekkError);
}

