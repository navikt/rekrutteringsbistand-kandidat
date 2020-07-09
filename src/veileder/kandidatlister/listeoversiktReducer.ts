import { HentStatus } from './kandidatlistetyper';
import { Reducer } from 'redux';

export enum ListeoversiktActionType {
    HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER',
    HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS',
    HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE',
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

export interface ResetKandidatlisterSokekriterierAction {
    type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER;
}

type ListeoversiktAction =
    | HentKandidatlisterAction
    | HentKandidatlisterSuccessAction
    | HentKandidatlisterFailureAction
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
