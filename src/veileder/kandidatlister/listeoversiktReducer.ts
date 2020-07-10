import {
    RemoteData,
    IkkeLastet,
    LasterInn,
    Nettstatus,
    Suksess,
    ResponseData,
} from './../../felles/common/remoteData';
import { HentStatus, MarkerSomMinStatus } from './kandidatlistetyper';
import { Reducer } from 'redux';

export enum ListeoversiktActionType {
    HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER',
    HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS',
    HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE',
    MARKER_KANDIDATLISTE_SOM_MIN = 'MARKER_KANDIDATLISTE_SOM_MIN',
    MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS = 'MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS',
    MARKER_KANDIDATLISTE_SOM_MIN_FAILURE = 'MARKER_KANDIDATLISTE_SOM_MIN',
    SLETT_KANDIDATLISTE = 'SLETT_KANDIDATLISTE',
    SLETT_KANDIDATLISTE_FERDIG = 'SLETT_KANDIDATLISTE_FERDIG',
    RESET_SLETTE_STATUS = 'RESET_SLETTE_STATUS',
    RESET_KANDIDATLISTER_SOKEKRITERIER = 'RESET_KANDIDATLISTER_SOKEKRITERIER',
}

export interface HentKandidatlisterAction {
    type: ListeoversiktActionType.HENT_KANDIDATLISTER;
    query: string;
    listetype: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
}

export interface HentKandidatlisterSuccessAction {
    type: ListeoversiktActionType.HENT_KANDIDATLISTER_SUCCESS;
    kandidatlister: {
        liste: any;
        antall: number;
    };
}

export interface HentKandidatlisterFailureAction {
    type: ListeoversiktActionType.HENT_KANDIDATLISTER_FAILURE;
}

export interface MarkerKandidatlisteSomMinAction {
    type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN;
}

export interface MarkerKandidatlisteSomMinSuccessAction {
    type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS;
}

export interface MarkerKandidatlisteSomMinFailureAction {
    type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE;
}

export interface SlettKandidatlisteAction {
    type: ListeoversiktActionType.SLETT_KANDIDATLISTE;
    kandidatliste: {
        tittel: string;
        kandidatlisteId: string;
    };
}

export interface SlettKandidatlisteFerdigAction {
    type: ListeoversiktActionType.SLETT_KANDIDATLISTE_FERDIG;
    result: ResponseData<any>;
    kandidatlisteTittel: string;
}

export interface ResetSletteStatusAction {
    type: ListeoversiktActionType.RESET_SLETTE_STATUS;
}

export interface ResetKandidatlisterSokekriterierAction {
    type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER;
}

type ListeoversiktAction =
    | HentKandidatlisterAction
    | HentKandidatlisterSuccessAction
    | HentKandidatlisterFailureAction
    | MarkerKandidatlisteSomMinAction
    | MarkerKandidatlisteSomMinSuccessAction
    | MarkerKandidatlisteSomMinFailureAction
    | SlettKandidatlisteAction
    | SlettKandidatlisteFerdigAction
    | ResetSletteStatusAction
    | ResetKandidatlisterSokekriterierAction;

export type ListeoversiktState = {
    hentListerStatus: HentStatus;
    kandidatlister: {
        liste: Array<any>;
        antall?: number;
    };
    søkekriterier: {
        query: string;
        type: string;
        kunEgne: boolean;
        pagenumber: number;
        pagesize: number;
    };
    slettKandidatlisteStatus: RemoteData<{
        slettetTittel: string;
    }>;
    markerSomMinStatus: MarkerSomMinStatus;
};

const initialState = {
    hentListerStatus: HentStatus.IkkeHentet,
    kandidatlister: {
        liste: [],
    },
    søkekriterier: {
        query: '',
        type: '',
        kunEgne: true,
        pagenumber: 0,
        pagesize: 20,
    },
    slettKandidatlisteStatus: IkkeLastet(),
    markerSomMinStatus: MarkerSomMinStatus.IkkeGjort,
};

const listeoversiktReducer: Reducer<ListeoversiktState, ListeoversiktAction> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ListeoversiktActionType.HENT_KANDIDATLISTER:
            return {
                ...state,
                hentListerStatus: HentStatus.Loading,
                søkekriterier: {
                    query: action.query,
                    type: action.listetype,
                    kunEgne: action.kunEgne,
                    pagenumber: action.pagenumber,
                    pagesize: action.pagesize,
                },
            };
        case ListeoversiktActionType.HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                hentListerStatus: HentStatus.Success,
                kandidatlister: {
                    liste: action.kandidatlister.liste,
                    antall: action.kandidatlister.antall,
                },
            };
        case ListeoversiktActionType.HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                hentListerStatus: HentStatus.Failure,
            };
        case ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Loading,
            };
        case ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Success,
            };
        case ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE:
            return {
                ...state,
                markerSomMinStatus: MarkerSomMinStatus.Failure,
            };
        case ListeoversiktActionType.SLETT_KANDIDATLISTE:
            return {
                ...state,
                slettKandidatlisteStatus: LasterInn(),
            };
        case ListeoversiktActionType.SLETT_KANDIDATLISTE_FERDIG:
            return {
                ...state,
                slettKandidatlisteStatus:
                    action.result.kind === Nettstatus.Suksess
                        ? Suksess({ slettetTittel: action.kandidatlisteTittel })
                        : action.result,
            };
        case ListeoversiktActionType.RESET_SLETTE_STATUS:
            return {
                ...state,
                slettKandidatlisteStatus: IkkeLastet(),
            };
        case ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER:
            return {
                ...state,
                kandidatlister: {
                    liste: [],
                    antall: undefined,
                },
                søkekriterier: {
                    query: '',
                    type: '',
                    kunEgne: true,
                    pagenumber: 0,
                    pagesize: 20,
                },
            };
        default:
            return state;
    }
};

export default listeoversiktReducer;
