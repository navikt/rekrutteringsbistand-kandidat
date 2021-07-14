import { ResponseData } from '../../api/remoteData';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../common/sorterbarKolonneheader/Retning';

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
    SET_SORTERING = 'SET_SORTERING',
    RESET_KANDIDATLISTER_SOKEKRITERIER = 'RESET_KANDIDATLISTER_SOKEKRITERIER',
}

export interface HentKandidatlisterAction {
    type: ListeoversiktActionType.HENT_KANDIDATLISTER;
    query: string;
    listetype: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
    sortField: KandidatlisteSorteringsfelt;
    sortDirection: Retning;
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
    kandidatlisteId: string;
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

export interface SetSortering {
    type: ListeoversiktActionType.SET_SORTERING;
    sortering: {
        sortField: KandidatlisteSorteringsfelt;
        sortDirection: Retning;
    };
}

export interface ResetKandidatlisterSokekriterierAction {
    type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER;
}

export type ListeoversiktAction =
    | HentKandidatlisterAction
    | HentKandidatlisterSuccessAction
    | HentKandidatlisterFailureAction
    | MarkerKandidatlisteSomMinAction
    | MarkerKandidatlisteSomMinSuccessAction
    | MarkerKandidatlisteSomMinFailureAction
    | SlettKandidatlisteAction
    | SlettKandidatlisteFerdigAction
    | ResetSletteStatusAction
    | SetSortering
    | ResetKandidatlisterSokekriterierAction;
