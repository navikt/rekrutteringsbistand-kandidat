import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { Retning } from '../../kandidatliste/liste-header/sorterbarKolonneheader/Retning';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { Søkekriterier } from './listeoversiktReducer';

export enum ListeoversiktActionType {
    HentKandidatlister = 'HENT_KANDIDATLISTER',
    HentKandidatlisterSuccess = 'HENT_KANDIDATLISTER_SUCCESS',
    HentKandidatlisterFailure = 'HENT_KANDIDATLISTER_FAILURE',
    SetSortering = 'SET_SORTERING',
    ResetKandidatlisterSokekriterier = 'RESET_KANDIDATLISTER_SOKEKRITERIER',
}

export interface HentKandidatlisterAction {
    type: ListeoversiktActionType.HentKandidatlister;
    søkekriterier: Søkekriterier;
}

export interface HentKandidatlisterSuccessAction {
    type: ListeoversiktActionType.HentKandidatlisterSuccess;
    kandidatlister: {
        liste: KandidatlisteSammendrag[];
        antall: number;
    };
}

export interface HentKandidatlisterFailureAction {
    type: ListeoversiktActionType.HentKandidatlisterFailure;
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
    | SetSortering
    | ResetKandidatlisterSokekriterierAction;
