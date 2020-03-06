import { ResponseData } from './../../../felles/common/remoteData';
import { KandidatlisteResponse, Notat } from './kandidatlisteReducer';
import KandidatlisteTypes from './KandidatlisteTypes';
import { Status } from '../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { ApiError } from '../../../felles/common/remoteData';

export interface OpprettKandidatlisteAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE;
    kandidatlisteInfo: {
        tittel: string;
        beskrivelse?: string;
        bedrift?: any;
    };
}

export interface OpprettKandidatlisteSuccessAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS;
    tittel: string;
}

export interface OpprettKandidatlisteFailureAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE;
}

export interface HentKandidatlisteMedStillingsIdAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID;
    stillingsId: string;
}

export interface HentKandidatlisteMedStillingsIdSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedStillingsIdFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE;
    error: ApiError;
}

export interface HentKandidatlisteMedKandidatlisteIdAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID;
    kandidatlisteId: string;
}

export interface HentKandidatlisteMedKandidatlisteIdSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedKandidatlisteIdFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE;
    error: ApiError;
}

export interface ResetLagreStatusAction {
    type: KandidatlisteTypes.RESET_LAGRE_STATUS;
}

export interface PresenterKandidaterAction {
    type: KandidatlisteTypes.PRESENTER_KANDIDATER;
    kandidatlisteId: string;
    kandidatnummerListe: Array<string>;
    beskjed?: string;
    mailadresser: Array<string>;
}

export interface PresenterKandidaterSuccessAction {
    type: KandidatlisteTypes.PRESENTER_KANDIDATER_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface PresenterKandidaterFailureAction {
    type: KandidatlisteTypes.PRESENTER_KANDIDATER_FAILURE;
}

export interface ResetDeleStatusAction {
    type: KandidatlisteTypes.RESET_DELE_STATUS;
}

export interface LeggTilKandidaterAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER;
    kandidatliste: {
        kandidatlisteId: string;
    };
    kandidater: Array<{
        kandidatnr: string;
        notat: string;
        sisteArbeidserfaring: string;
    }>;
}

export interface LeggTilKandidaterSuccessAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS;
    antallLagredeKandidater: number;
    lagretListe: any;
    kandidatliste: KandidatlisteResponse;
}

export interface LeggTilKandidaterFailureAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE;
}

export interface LagreKandidatIKandidatlisteAction {
    type: KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE;
}

export interface LagreKandidatIKandidatlisteSuccessAction {
    type: KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS;
}

export interface LagreKandidatIKandidatlisteFailureAction {
    type: KandidatlisteTypes.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE;
}

export interface OppdaterKandidatlisteAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE;
}

export interface OppdaterKandidatlisteSuccessAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS;
    tittel: string;
}

export interface OppdaterKandidatlisteFailureAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE;
}

export interface EndreStatusKandidatAction {
    type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT;
    status: Status;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreStatusKandidatSuccessAction {
    type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface EndreStatusKandidatFailureAction {
    type: KandidatlisteTypes.ENDRE_STATUS_KANDIDAT_FAILURE;
}

export interface SetFodselsnummerAction {
    type: KandidatlisteTypes.SET_FODSELSNUMMER;
    fodselsnummer: string;
}

export interface SetNotatAction {
    type: KandidatlisteTypes.SET_NOTAT;
    notat: string;
}

export interface HentKandidatMedFnrAction {
    type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR;
    fodselsnummer: string;
}

export interface HentKandidatMedFnrSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_SUCCESS;
    kandidat: any;
}

export interface HentKandidatMedFnrNotFoundAction {
    type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_NOT_FOUND;
}

export interface HentKandidatMedFnrFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_FAILURE;
}

export interface HentKandidatMedFnrResetAction {
    type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_RESET;
}

export interface HentNotaterAction {
    type: KandidatlisteTypes.HENT_NOTATER;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface HentNotaterSuccessAction {
    type: KandidatlisteTypes.HENT_NOTATER_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface HentNotaterFailureAction {
    type: KandidatlisteTypes.HENT_NOTATER_FAILURE;
}

export interface OpprettNotatAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    tekst: string;
}

export interface OpprettNotatSuccessAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface OpprettNotatFailureAction {
    type: KandidatlisteTypes.OPPRETT_NOTAT_FAILURE;
}

export interface HentKandidatlisterAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER;
    query: string;
    listetype: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
}

export interface HentKandidatlisterSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS;
    kandidatlister: {
        liste: any;
        antall: number;
    };
}

export interface HentKandidatlisterFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE;
}

export interface ResetKandidatlisterSokekriterierAction {
    type: KandidatlisteTypes.RESET_KANDIDATLISTER_SOKEKRITERIER;
}

export interface HentKandidatlisteMedAnnonsenummerAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER;
}

export interface HentKandidatlisteMedAnnonsenummerSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedAnnonsenummerNotFoundAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND;
}

export interface HentKandidatlisteMedAnnonsenummerFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE;
}

export interface EndreNotatAction {
    type: KandidatlisteTypes.ENDRE_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
    tekst: string;
}

export interface EndreNotatSuccessAction {
    type: KandidatlisteTypes.ENDRE_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface EndreNotatFailureAction {
    type: KandidatlisteTypes.ENDRE_NOTAT_FAILURE;
}

export interface SlettNotatAction {
    type: KandidatlisteTypes.SLETT_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
}

export interface SlettNotatSuccessAction {
    type: KandidatlisteTypes.SLETT_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface SlettNotatFailureAction {
    type: KandidatlisteTypes.SLETT_NOTAT_FAILURE;
}

export interface MarkerKandidatlisteSomMinAction {
    type: KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN;
}

export interface MarkerKandidatlisteSomMinSuccessAction {
    type: KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS;
}

export interface MarkerKandidatlisteSomMinFailureAction {
    type: KandidatlisteTypes.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE;
}

export interface SlettKandidatlisteAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE;
    kandidatliste: {
        tittel: string;
        kandidatlisteId: string;
    };
}

export interface SlettKandidatlisteFerdigAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE_FERDIG;
    result: ResponseData<any>;
    kandidatlisteTittel: string;
}

export interface ResetSletteStatusAction {
    type: KandidatlisteTypes.RESET_SLETTE_STATUS;
}

export interface ToggleErSlettetAction {
    type: KandidatlisteTypes.TOGGLE_ER_SLETTET;
    kandidatlisteId: string;
    kandidatnr: string;
    erSlettet: boolean;
}

export interface ToggleErSlettetSuccessAction {
    type: KandidatlisteTypes.TOGGLE_ER_SLETTET_SUCCESS;
    kandidatnr: string;
    erSlettet: boolean;
}

export interface ToggleErSlettetFailureAction {
    type: KandidatlisteTypes.TOGGLE_ER_SLETTET_FAILURE;
}

type KandidatlisteAction =
    | OpprettKandidatlisteAction
    | OpprettKandidatlisteSuccessAction
    | OpprettKandidatlisteFailureAction
    | HentKandidatlisteMedStillingsIdAction
    | HentKandidatlisteMedStillingsIdSuccessAction
    | HentKandidatlisteMedStillingsIdFailureAction
    | HentKandidatlisteMedKandidatlisteIdAction
    | HentKandidatlisteMedKandidatlisteIdSuccessAction
    | HentKandidatlisteMedKandidatlisteIdFailureAction
    | ResetLagreStatusAction
    | PresenterKandidaterAction
    | PresenterKandidaterSuccessAction
    | PresenterKandidaterFailureAction
    | ResetDeleStatusAction
    | LeggTilKandidaterAction
    | LeggTilKandidaterSuccessAction
    | LeggTilKandidaterFailureAction
    | LagreKandidatIKandidatlisteAction
    | LagreKandidatIKandidatlisteSuccessAction
    | LagreKandidatIKandidatlisteFailureAction
    | OppdaterKandidatlisteAction
    | OppdaterKandidatlisteSuccessAction
    | OppdaterKandidatlisteFailureAction
    | EndreStatusKandidatAction
    | EndreStatusKandidatSuccessAction
    | EndreStatusKandidatFailureAction
    | SetFodselsnummerAction
    | SetNotatAction
    | HentKandidatMedFnrAction
    | HentKandidatMedFnrSuccessAction
    | HentKandidatMedFnrNotFoundAction
    | HentKandidatMedFnrFailureAction
    | HentKandidatMedFnrResetAction
    | HentNotaterAction
    | HentNotaterSuccessAction
    | HentNotaterFailureAction
    | OpprettNotatAction
    | OpprettNotatSuccessAction
    | OpprettNotatFailureAction
    | HentKandidatlisterAction
    | HentKandidatlisterSuccessAction
    | HentKandidatlisterFailureAction
    | ResetKandidatlisterSokekriterierAction
    | HentKandidatlisteMedAnnonsenummerAction
    | HentKandidatlisteMedAnnonsenummerSuccessAction
    | HentKandidatlisteMedAnnonsenummerNotFoundAction
    | HentKandidatlisteMedAnnonsenummerFailureAction
    | EndreNotatAction
    | EndreNotatSuccessAction
    | EndreNotatFailureAction
    | SlettNotatAction
    | SlettNotatSuccessAction
    | SlettNotatFailureAction
    | MarkerKandidatlisteSomMinAction
    | MarkerKandidatlisteSomMinSuccessAction
    | MarkerKandidatlisteSomMinFailureAction
    | SlettKandidatlisteAction
    | SlettKandidatlisteFerdigAction
    | ResetSletteStatusAction
    | ToggleErSlettetAction
    | ToggleErSlettetSuccessAction
    | ToggleErSlettetFailureAction;

export default KandidatlisteAction;
