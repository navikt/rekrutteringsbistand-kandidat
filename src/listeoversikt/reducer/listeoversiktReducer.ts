import { ikkeLastet, lasterInn, Nettstatus, RemoteData, suksess } from '../../api/remoteData';
import { HentStatus, MarkerSomMinStatus } from '../../kandidatliste/kandidatlistetyper';
import { Reducer } from 'redux';
import { ListeoversiktAction, ListeoversiktActionType } from './ListeoversiktAction';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../common/sorterbarKolonneheader/Retning';

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
    sortering: {
        sortField: KandidatlisteSorteringsfelt | null;
        sortDirection: Retning | null;
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
    sortering: {
        sortField: null,
        sortDirection: null,
    },
    slettKandidatlisteStatus: ikkeLastet(),
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
                slettKandidatlisteStatus: lasterInn(),
            };
        case ListeoversiktActionType.SLETT_KANDIDATLISTE_FERDIG:
            return {
                ...state,
                slettKandidatlisteStatus:
                    action.result.kind === Nettstatus.Suksess
                        ? suksess({ slettetTittel: action.kandidatlisteTittel })
                        : action.result,
            };
        case ListeoversiktActionType.RESET_SLETTE_STATUS:
            return {
                ...state,
                slettKandidatlisteStatus: ikkeLastet(),
            };
        case ListeoversiktActionType.SET_SORTERING:
            return {
                ...state,
                hentListerStatus: HentStatus.Loading,
                sortering: {
                    sortField: action.sortering.sortField,
                    sortDirection: action.sortering.sortDirection,
                },
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
