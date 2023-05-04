import { Nettstatus } from '../../api/Nettressurs';
import { Reducer } from 'redux';
import { ListeoversiktAction, ListeoversiktActionType } from './ListeoversiktAction';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../kandidatliste/liste-header/sorterbarKolonneheader/Retning';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { Stillingsfilter } from '../filter/Filter';

export type Søkekriterier = {
    query: string;
    type: Stillingsfilter;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
};

export type ListeoversiktState = {
    hentListerStatus: Nettstatus;
    kandidatlister: {
        liste: Array<KandidatlisteSammendrag>;
        antall?: number;
    };
    søkekriterier: Søkekriterier;
    sortering: {
        sortField: KandidatlisteSorteringsfelt | null;
        sortDirection: Retning | null;
    };
};

const initialState = {
    hentListerStatus: Nettstatus.IkkeLastet,
    kandidatlister: {
        liste: [],
    },
    søkekriterier: {
        query: '',
        type: Stillingsfilter.Ingen,
        kunEgne: true,
        pagenumber: 0,
        pagesize: 20,
    },
    sortering: {
        sortField: null,
        sortDirection: null,
    },
};

const listeoversiktReducer: Reducer<ListeoversiktState, ListeoversiktAction> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ListeoversiktActionType.HentKandidatlister:
            return {
                ...state,
                hentListerStatus: Nettstatus.LasterInn,
                søkekriterier: action.søkekriterier,
            };
        case ListeoversiktActionType.HentKandidatlisterSuccess:
            return {
                ...state,
                hentListerStatus: Nettstatus.Suksess,
                kandidatlister: {
                    liste: action.kandidatlister.liste,
                    antall: action.kandidatlister.antall,
                },
            };
        case ListeoversiktActionType.HentKandidatlisterFailure:
            return {
                ...state,
                hentListerStatus: Nettstatus.Feil,
            };
        case ListeoversiktActionType.SetSortering:
            return {
                ...state,
                hentListerStatus: Nettstatus.LasterInn,
                sortering: {
                    sortField: action.sortering.sortField,
                    sortDirection: action.sortering.sortDirection,
                },
            };
        case ListeoversiktActionType.ResetKandidatlisterSokekriterier:
            return {
                ...state,
                kandidatlister: {
                    liste: [],
                    antall: undefined,
                },
                søkekriterier: {
                    query: '',
                    type: Stillingsfilter.Ingen,
                    kunEgne: true,
                    pagenumber: 0,
                    pagesize: 20,
                },
                sortering: {
                    sortDirection: null,
                    sortField: null,
                },
            };
        default:
            return state;
    }
};

export default listeoversiktReducer;
