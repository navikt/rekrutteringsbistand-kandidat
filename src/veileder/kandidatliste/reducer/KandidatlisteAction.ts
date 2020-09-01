import { ApiError } from '../../../felles/common/remoteData';
import { Kandidatliste, Notat, Navn, Sms, Kandidat } from '../kandidatlistetyper';
import { Kandidatlistefilter } from '../kandidatlistetyper';
import { Kandidatresultat } from './../../kandidatside/cv/reducer/cv-typer';
import {
    NyKandidat,
    NyUsynligKandidat,
} from './../modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { SearchApiError } from './../../../felles/api';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Visningsstatus } from './../Kandidatliste';
import KandidatlisteActionType from './KandidatlisteActionType';

export interface HentKandidatlisteMedStillingsIdAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID;
    stillingsId: string;
}

export interface HentKandidatlisteMedStillingsIdSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS;
    kandidatliste: Kandidatliste;
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
    kandidatliste: Kandidatliste;
}

export interface HentKandidatlisteMedKandidatlisteIdFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE;
    error: ApiError;
}

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

export interface ResetLagreStatusAction {
    type: KandidatlisteActionType.RESET_LAGRE_STATUS;
}

export interface PresenterKandidaterAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER;
    kandidatlisteId: string;
    kandidatnummerListe: Array<string>;
    beskjed?: string;
    mailadresser: Array<string>;
    navKontor: string;
}

export interface PresenterKandidaterSuccessAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER_SUCCESS;
    kandidatliste: Kandidatliste;
}

export interface PresenterKandidaterFailureAction {
    type: KandidatlisteActionType.PRESENTER_KANDIDATER_FAILURE;
}

export interface ResetDeleStatusAction {
    type: KandidatlisteActionType.RESET_DELESTATUS;
}

export interface LeggTilKandidaterAction {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER;
    kandidatliste: {
        kandidatlisteId: string;
    };
    kandidater: Array<NyKandidat>;
}

export interface LeggTilKandidaterSuccessAction {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_SUCCESS;
    antallLagredeKandidater: number;
    lagretListe: any;
    lagredeKandidater: Array<NyKandidat>;
    kandidatliste: Kandidatliste;
}

export interface LeggTilKandidaterFailureAction {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_FAILURE;
}

export interface LagreKandidatIKandidatlisteAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE;
    // TODO: Typesett denne skikkelig
}

export interface LagreKandidatIKandidatlisteSuccessAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS;
}

export interface LagreKandidatIKandidatlisteFailureAction {
    type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE;
}

export interface RegistrerUsynligKandidatAction {
    type: KandidatlisteActionType.REGISTRER_USYNLIG_KANDIDAT;
    kandidatlisteId: string;
    nyUsynligKandidat: NyUsynligKandidat;
}

export interface RegistrerUsynligKandidatSuccessAction {
    type: KandidatlisteActionType.REGISTRER_USYNLIG_KANDIDAT_SUCCESS;
    kandidatliste: Kandidatliste;
    nyUsynligKandidat: NyUsynligKandidat;
}

export interface RegistrerUsynligKandidatFailureAction {
    type: KandidatlisteActionType.REGISTRER_USYNLIG_KANDIDAT_FAILURE;
    error: ApiError;
}

export interface EndreStatusKandidatAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT;
    status: Status;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreStatusKandidatSuccessAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_SUCCESS;
    kandidatliste: Kandidatliste;
}

export interface EndreStatusKandidatFailureAction {
    type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT_FAILURE;
}

export interface EndreUtfallKandidatAction {
    type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT;
    utfall: Utfall;
    navKontor: string;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreUtfallKandidatSuccessAction {
    type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT_SUCCESS;
    kandidatliste: Kandidatliste;
}

export interface EndreUtfallKandidatFailureAction {
    type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT_FAILURE;
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
    kandidat: Kandidatresultat;
}

export interface HentKandidatMedFnrNotFoundAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_NOT_FOUND;
}

export interface HentKandidatMedFnrFailureAction {
    type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR_FAILURE;
}

export interface LeggTilKandidatSøkReset {
    type: KandidatlisteActionType.LEGG_TIL_KANDIDAT_SØK_RESET;
}

export interface HentUsynligKandidatAction {
    type: KandidatlisteActionType.HENT_USYNLIG_KANDIDAT;
    fodselsnummer: string;
}

export interface HentUsynligKandidatSuccessAction {
    type: KandidatlisteActionType.HENT_USYNLIG_KANDIDAT_SUCCESS;
    navn: Navn[];
}

export interface HentUsynligKandidatFailureAction {
    type: KandidatlisteActionType.HENT_USYNLIG_KANDIDAT_FAILURE;
    error: ApiError;
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

export interface HentKandidatlisteMedAnnonsenummerAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER;
}

export interface HentKandidatlisteMedAnnonsenummerSuccessAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS;
    kandidatliste: Kandidatliste;
}

export interface HentKandidatlisteMedAnnonsenummerNotFoundAction {
    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND;
    message: string;
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

export interface ToggleArkivertAction {
    type: KandidatlisteActionType.TOGGLE_ARKIVERT;
    kandidatlisteId: string;
    kandidatnr: string;
    arkivert: boolean;
}

export interface ToggleArkivertSuccessAction {
    type: KandidatlisteActionType.TOGGLE_ARKIVERT_SUCCESS;
    kandidat: Kandidat;
}

export interface ToggleArkivertFailureAction {
    type: KandidatlisteActionType.TOGGLE_ARKIVERT_FAILURE;
}

export interface AngreArkiveringAction {
    type: KandidatlisteActionType.ANGRE_ARKIVERING;
    kandidatlisteId: string;
    kandidatnumre: string[];
}

export interface AngreArkiveringSuccessAction {
    type: KandidatlisteActionType.ANGRE_ARKIVERING_SUCCESS;
    kandidatnumre: string[];
}

export interface AngreArkiveringFailureAction {
    type: KandidatlisteActionType.ANGRE_ARKIVERING_FAILURE;
}

export interface VelgKandidatAction {
    type: KandidatlisteActionType.VELG_KANDIDAT;
    kandidatlisteId?: string;
    kandidatnr?: string;
}

export interface SendSmsAction {
    type: KandidatlisteActionType.SEND_SMS;
    melding: string;
    fnr: string[];
    kandidatlisteId: string;
}

export interface SendSmsSuccessAction {
    type: KandidatlisteActionType.SEND_SMS_SUCCESS;
}

export interface SendSmsFailureAction {
    type: KandidatlisteActionType.SEND_SMS_FAILURE;
    error: SearchApiError;
}

export interface ResetSendSmsStatusAction {
    type: KandidatlisteActionType.RESET_SEND_SMS_STATUS;
}

export interface HentSendteMeldingerAction {
    type: KandidatlisteActionType.HENT_SENDTE_MELDINGER;
    kandidatlisteId: string;
}

export interface HentSendteMeldingerSuccessAction {
    type: KandidatlisteActionType.HENT_SENDTE_MELDINGER_SUCCESS;
    sendteMeldinger: Sms[];
}

export interface HentSendteMeldingerFailureAction {
    type: KandidatlisteActionType.HENT_SENDTE_MELDINGER_FAILURE;
    error: SearchApiError;
}

export interface EndreKandidatlistefilterAction {
    type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER;
    filter: Kandidatlistefilter;
}

export interface ToggleMarkeringAvKandidat {
    type: KandidatlisteActionType.TOGGLE_MARKERING_AV_KANDIDAT;
    kandidatnr: string;
}

export interface EndreMarkeringAvKandidaterAction {
    type: KandidatlisteActionType.ENDRE_MARKERING_AV_KANDIDATER;
    kandidatnumre: string[];
}

export interface EndreVisningsstatusKandidatAction {
    type: KandidatlisteActionType.ENDRE_VISNINGSSTATUS_KANDIDAT;
    kandidatnr: string;
    visningsstatus: Visningsstatus;
}

type KandidatlisteAction =
    | OpprettKandidatlisteAction
    | OpprettKandidatlisteSuccessAction
    | OpprettKandidatlisteFailureAction
    | OppdaterKandidatlisteAction
    | OppdaterKandidatlisteSuccessAction
    | OppdaterKandidatlisteFailureAction
    | ResetLagreStatusAction
    | HentKandidatlisteMedStillingsIdAction
    | HentKandidatlisteMedStillingsIdSuccessAction
    | HentKandidatlisteMedStillingsIdFailureAction
    | HentKandidatlisteMedKandidatlisteIdAction
    | HentKandidatlisteMedKandidatlisteIdSuccessAction
    | HentKandidatlisteMedKandidatlisteIdFailureAction
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
    | EndreStatusKandidatAction
    | EndreStatusKandidatSuccessAction
    | EndreStatusKandidatFailureAction
    | EndreUtfallKandidatAction
    | EndreUtfallKandidatSuccessAction
    | EndreUtfallKandidatFailureAction
    | SetFodselsnummerAction
    | SetNotatAction
    | HentKandidatMedFnrAction
    | HentKandidatMedFnrSuccessAction
    | HentKandidatMedFnrNotFoundAction
    | HentKandidatMedFnrFailureAction
    | LeggTilKandidatSøkReset
    | HentUsynligKandidatAction
    | HentUsynligKandidatSuccessAction
    | HentUsynligKandidatFailureAction
    | HentNotaterAction
    | HentNotaterSuccessAction
    | HentNotaterFailureAction
    | OpprettNotatAction
    | OpprettNotatSuccessAction
    | OpprettNotatFailureAction
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
    | ToggleArkivertAction
    | ToggleArkivertSuccessAction
    | ToggleArkivertFailureAction
    | SendSmsAction
    | SendSmsSuccessAction
    | SendSmsFailureAction
    | ResetSendSmsStatusAction
    | HentSendteMeldingerAction
    | HentSendteMeldingerSuccessAction
    | HentSendteMeldingerFailureAction
    | AngreArkiveringAction
    | AngreArkiveringSuccessAction
    | AngreArkiveringFailureAction
    | VelgKandidatAction
    | EndreKandidatlistefilterAction
    | ToggleMarkeringAvKandidat
    | EndreMarkeringAvKandidaterAction
    | EndreVisningsstatusKandidatAction
    | RegistrerUsynligKandidatAction
    | RegistrerUsynligKandidatSuccessAction
    | RegistrerUsynligKandidatFailureAction;

export default KandidatlisteAction;
