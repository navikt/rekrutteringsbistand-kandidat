import { Nettressurs } from '../../api/Nettressurs';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../common/sorterbarKolonneheader/Retning';

export enum ListeoversiktActionType {
    HentKandidatlister = 'HENT_KANDIDATLISTER',
    HentKandidatlisterSuccess = 'HENT_KANDIDATLISTER_SUCCESS',
    HentKandidatlisterFailure = 'HENT_KANDIDATLISTER_FAILURE',
    MarkerKandidatlisteSomMin = 'MARKER_KANDIDATLISTE_SOM_MIN',
    MarkerKandidatlisteSomMinSuccess = 'MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS',
    MarkerKandidatlisteSomMinFailure = 'MARKER_KANDIDATLISTE_SOM_MIN',
    SlettKandidatliste = 'SLETT_KANDIDATLISTE',
    SlettKandidatlisteFerdig = 'SLETT_KANDIDATLISTE_FERDIG',
    ResetSletteStatus = 'RESET_SLETTE_STATUS',
    SetSortering = 'SET_SORTERING',
    ResetKandidatlisterSokekriterier = 'RESET_KANDIDATLISTER_SOKEKRITERIER',
}

export interface HentKandidatlisterAction {
    type: ListeoversiktActionType.HentKandidatlister;
    query: string;
    listetype: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
    sortField: KandidatlisteSorteringsfelt;
    sortDirection: Retning;
}

export interface HentKandidatlisterSuccessAction {
    type: ListeoversiktActionType.HentKandidatlisterSuccess;
    kandidatlister: {
        liste: any;
        antall: number;
    };
}

export interface HentKandidatlisterFailureAction {
    type: ListeoversiktActionType.HentKandidatlisterFailure;
}

export interface MarkerKandidatlisteSomMinAction {
    type: ListeoversiktActionType.MarkerKandidatlisteSomMin;
    kandidatlisteId: string;
}

export interface MarkerKandidatlisteSomMinSuccessAction {
    type: ListeoversiktActionType.MarkerKandidatlisteSomMinSuccess;
}

export interface MarkerKandidatlisteSomMinFailureAction {
    type: ListeoversiktActionType.MarkerKandidatlisteSomMinFailure;
}

export interface SlettKandidatlisteAction {
    type: ListeoversiktActionType.SlettKandidatliste;
    kandidatliste: {
        tittel: string;
        kandidatlisteId: string;
    };
}

export interface SlettKandidatlisteFerdigAction {
    type: ListeoversiktActionType.SlettKandidatlisteFerdig;
    result: Nettressurs<any>;
    kandidatlisteTittel: string;
}

export interface ResetSletteStatusAction {
    type: ListeoversiktActionType.ResetSletteStatus;
}

export interface SetSortering {
    type: ListeoversiktActionType.SetSortering;
    sortering: {
        sortField: KandidatlisteSorteringsfelt;
        sortDirection: Retning;
    };
}

export interface ResetKandidatlisterSokekriterierAction {
    type: ListeoversiktActionType.ResetKandidatlisterSokekriterier;
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
