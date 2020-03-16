import { ResponseData } from './../../../felles/common/remoteData';
import { KandidatlisteResponse, Notat } from '../kandidatlistetyper';
import KandidatlisteActionType from './KandidatlisteActionType';
import { Status } from '../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { ApiError } from '../../../felles/common/remoteData';

export interface OpprettKandidatlisteAction {
    type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE;
    kandidatlisteInfo: {
        tittel: string;
        beskrivelse?: string;
        bedrift?: any;
    };
}

export interface OpprettKandidatlisteSuccessAction {
    type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE_SUCCESS;
    tittel: string;
}

export interface OpprettKandidatlisteFailureAction {
    type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE_FAILURE;
}

export interface HentKandidatlisteMedStillingsIdAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID;
    stillingsId: string;
}

export interface HentKandidatlisteMedStillingsIdSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedStillingsIdFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE;
    error: ApiError;
}

export interface HentKandidatlisteMedKandidatlisteIdAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID;
    kandidatlisteId: string;
}

export interface HentKandidatlisteMedKandidatlisteIdSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedKandidatlisteIdFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE;
    error: ApiError;
}

export interface ResetLagreStatusAction {
    type: KandidatlisteActionType.RESET_LAGRE_STATUS;
}

export interface PresenterKandidaterAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER;
    kandidatlisteId: string;
    kandidatnummerListe: Array<string>;
    beskjed?: string;
    mailadresser: Array<string>;
}

export interface PresenterKandidaterSuccessAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface PresenterKandidaterFailureAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE;
}

export interface ResetDeleStatusAction {
    type: KandidatlisteActionType.RESET_Delestatus;
}

export interface LeggTilKandidaterAction {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER;
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
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_SUCCESS;
    antallLagredeKandidater: number;
    lagretListe: any;
    kandidatliste: KandidatlisteResponse;
}

export interface LeggTilKandidaterFailureAction {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE;
}

export interface LagreKandidatIKandidatlisteAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE;
}

export interface LagreKandidatIKandidatlisteSuccessAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS;
}

export interface LagreKandidatIKandidatlisteFailureAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE;
}

export interface OppdaterKandidatlisteAction {
    type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE;
}

export interface OppdaterKandidatlisteSuccessAction {
    type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE_SUCCESS;
    tittel: string;
}

export interface OppdaterKandidatlisteFailureAction {
    type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE_FAILURE;
}

export interface EndreStatusKandidatAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT;
    status: Status;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreStatusKandidatSuccessAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface EndreStatusKandidatFailureAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_FAILURE;
}

export interface SetFodselsnummerAction {
    type: KandidatlisteActionType.SET_FODSELSNUMMER;
    fodselsnummer: string;
}

export interface SetNotatAction {
    type: KandidatlisteActionType.SET_NOTAT;
    notat: string;
}

export interface HentKandidatMedFnrAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR;
    fodselsnummer: string;
}

export interface HentKandidatMedFnrSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_SUCCESS;
    kandidat: any;
}

export interface HentKandidatMedFnrNotFoundAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_NOT_FOUND;
}

export interface HentKandidatMedFnrFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_FAILURE;
}

export interface HentKandidatMedFnrResetAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_RESET;
}

export interface HentNotaterAction {
    type: KandidatlisteActionType.HENT_NOTATER;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface HentNotaterSuccessAction {
    type: KandidatlisteActionType.HENT_NOTATER_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface HentNotaterFailureAction {
    type: KandidatlisteActionType.HENT_NOTATER_FAILURE;
}

export interface OpprettNotatAction {
    type: KandidatlisteActionType.OPPRETT_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    tekst: string;
}

export interface OpprettNotatSuccessAction {
    type: KandidatlisteActionType.OPPRETT_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface OpprettNotatFailureAction {
    type: KandidatlisteActionType.OPPRETT_NOTAT_FAILURE;
}

export interface HentKandidatlisterAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTER;
    query: string;
    listetype: string;
    kunEgne: boolean;
    pagenumber: number;
    pagesize: number;
}

export interface HentKandidatlisterSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTER_SUCCESS;
    kandidatlister: {
        liste: any;
        antall: number;
    };
}

export interface HentKandidatlisterFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTER_FAILURE;
}

export interface ResetKandidatlisterSokekriterierAction {
    type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER;
}

export interface HentKandidatlisteMedAnnonsenummerAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER;
}

export interface HentKandidatlisteMedAnnonsenummerSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS;
    kandidatliste: KandidatlisteResponse;
}

export interface HentKandidatlisteMedAnnonsenummerNotFoundAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND;
}

export interface HentKandidatlisteMedAnnonsenummerFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE;
}

export interface EndreNotatAction {
    type: KandidatlisteActionType.ENDRE_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
    tekst: string;
}

export interface EndreNotatSuccessAction {
    type: KandidatlisteActionType.ENDRE_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface EndreNotatFailureAction {
    type: KandidatlisteActionType.ENDRE_NOTAT_FAILURE;
}

export interface SlettNotatAction {
    type: KandidatlisteActionType.SLETT_NOTAT;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
}

export interface SlettNotatSuccessAction {
    type: KandidatlisteActionType.SLETT_NOTAT_SUCCESS;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface SlettNotatFailureAction {
    type: KandidatlisteActionType.SLETT_NOTAT_FAILURE;
}

export interface MarkerKandidatlisteSomMinAction {
    type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN;
}

export interface MarkerKandidatlisteSomMinSuccessAction {
    type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS;
}

export interface MarkerKandidatlisteSomMinFailureAction {
    type: KandidatlisteActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE;
}

export interface SlettKandidatlisteAction {
    type: KandidatlisteActionType.SLETT_KANDIDATLISTE;
    kandidatliste: {
        tittel: string;
        kandidatlisteId: string;
    };
}

export interface SlettKandidatlisteFerdigAction {
    type: KandidatlisteActionType.SLETT_KANDIDATLISTE_FERDIG;
    result: ResponseData<any>;
    kandidatlisteTittel: string;
}

export interface ResetSletteStatusAction {
    type: KandidatlisteActionType.RESET_SLETTE_STATUS;
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
    | ResetSletteStatusAction;

export default KandidatlisteAction;
