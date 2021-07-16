import { ikkeLastet, lasterInn, Nettstatus, Nettressurs, suksess } from '../../api/Nettressurs';
import { Reducer } from 'redux';
import { ListeoversiktAction, ListeoversiktActionType } from './ListeoversiktAction';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../common/sorterbarKolonneheader/Retning';

export type ListeoversiktState = {
    hentListerStatus: Nettstatus;
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
    sortering: {
        sortField: KandidatlisteSorteringsfelt | null;
        sortDirection: Retning | null;
    };
    slettKandidatlisteStatus: Nettressurs<{
        slettetTittel: string;
    }>;
    markerSomMinStatus: Nettstatus;
};

const initialState = {
    hentListerStatus: Nettstatus.IkkeLastet,
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
    sortering: {
        sortField: null,
        sortDirection: null,
    },
    slettKandidatlisteStatus: ikkeLastet(),
    markerSomMinStatus: Nettstatus.IkkeLastet,
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
                søkekriterier: {
                    query: action.query,
                    type: action.listetype,
                    kunEgne: action.kunEgne,
                    pagenumber: action.pagenumber,
                    pagesize: action.pagesize,
                },
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
        case ListeoversiktActionType.MarkerKandidatlisteSomMin:
            return {
                ...state,
                markerSomMinStatus: Nettstatus.LasterInn,
            };
        case ListeoversiktActionType.MarkerKandidatlisteSomMinSuccess:
            return {
                ...state,
                markerSomMinStatus: Nettstatus.Suksess,
            };
        case ListeoversiktActionType.MarkerKandidatlisteSomMinFailure:
            return {
                ...state,
                markerSomMinStatus: Nettstatus.Feil,
            };
        case ListeoversiktActionType.SlettKandidatliste:
            return {
                ...state,
                slettKandidatlisteStatus: lasterInn(),
            };
        case ListeoversiktActionType.SlettKandidatlisteFerdig:
            return {
                ...state,
                slettKandidatlisteStatus:
                    action.result.kind === Nettstatus.Suksess
                        ? suksess({ slettetTittel: action.kandidatlisteTittel })
                        : action.result,
            };
        case ListeoversiktActionType.ResetSletteStatus:
            return {
                ...state,
                slettKandidatlisteStatus: ikkeLastet(),
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
                    type: '',
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
