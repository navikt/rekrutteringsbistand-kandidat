import { Kandidatlistestatus } from '../domene/Kandidatliste';
import { AktørId, Kandidatstatus, Kandidatutfall, UsynligKandidat } from '../domene/Kandidat';
import {
    KandidatOutboundDto,
    FormidlingAvUsynligKandidatOutboundDto,
} from '../modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { ApiError } from '../../api/Nettressurs';
import { Kandidatliste } from '../domene/Kandidatliste';
import { Notat, Visningsstatus } from '../domene/Kandidatressurser';
import { Kandidat } from '../domene/Kandidat';
import { CvSøkeresultat } from '../../kandidatside/cv/reducer/cv-typer';
import KandidatlisteActionType from './KandidatlisteActionType';
import { SearchApiError } from '../../api/fetchUtils';
import {
    ForespørselOmDelingAvCv,
    ForespørselOutboundDto,
    ForespørslerGruppertPåAktørId,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Sms } from '../domene/Kandidatressurser';
import { Kandidatlistefilter, Kandidatsortering } from './kandidatlisteReducer';

export interface HentKandidatlisteMedStillingsIdAction {
    type: KandidatlisteActionType.HentKandidatlisteMedStillingsId;
    stillingsId: string;
}

export interface HentKandidatlisteMedStillingsIdSuccessAction {
    type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdSuccess;
    kandidatliste: Kandidatliste;
}

export interface HentKandidatlisteMedStillingsIdFailureAction {
    type: KandidatlisteActionType.HentKandidatlisteMedStillingsIdFailure;
    error: ApiError;
}

export interface HentKandidatlisteMedKandidatlisteIdAction {
    type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId;
    kandidatlisteId: string;
}

export interface HentKandidatlisteMedKandidatlisteIdSuccessAction {
    type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdSuccess;
    kandidatliste: Kandidatliste;
}

export interface HentKandidatlisteMedKandidatlisteIdFailureAction {
    type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteIdFailure;
    error: ApiError;
}

export type Kandidatlisteinfo = {
    tittel: string;
    beskrivelse?: string;
    bedrift?: any;
};

export interface OpprettKandidatlisteAction {
    type: KandidatlisteActionType.OpprettKandidatliste;
    kandidatlisteInfo: Kandidatlisteinfo;
}

export interface OpprettKandidatlisteSuccessAction {
    type: KandidatlisteActionType.OpprettKandidatlisteSuccess;
    tittel: string;
}

export interface OpprettKandidatlisteFailureAction {
    type: KandidatlisteActionType.OpprettKandidatlisteFailure;
}

export interface OppdaterKandidatlisteAction {
    type: KandidatlisteActionType.OppdaterKandidatliste;
}

export interface OppdaterKandidatlisteSuccessAction {
    type: KandidatlisteActionType.OppdaterKandidatlisteSuccess;
    tittel: string;
}

export interface OppdaterKandidatlisteFailureAction {
    type: KandidatlisteActionType.OppdaterKandidatlisteFailure;
}

export interface ResetLagreStatusAction {
    type: KandidatlisteActionType.ResetLagreStatus;
}

export interface PresenterKandidaterAction {
    type: KandidatlisteActionType.PresenterKandidater;
    kandidatlisteId: string;
    kandidatnummerListe: Array<string>;
    beskjed?: string;
    mailadresser: Array<string>;
    navKontor: string;
}

export interface PresenterKandidaterSuccessAction {
    type: KandidatlisteActionType.PresenterKandidaterSuccess;
    kandidatliste: Kandidatliste;
}

export interface PresenterKandidaterFailureAction {
    type: KandidatlisteActionType.PresenterKandidaterFailure;
}

export interface ResetDeleStatusAction {
    type: KandidatlisteActionType.ResetDelestatus;
}

export interface LeggTilKandidaterAction {
    type: KandidatlisteActionType.LeggTilKandidater;
    kandidatliste: {
        kandidatlisteId: string;
    };
    kandidater: Array<KandidatOutboundDto>;
}

export interface LeggTilKandidaterSuccessAction {
    type: KandidatlisteActionType.LeggTilKandidaterSuccess;
    antallLagredeKandidater: number;
    lagretListe: any;
    lagredeKandidater: Array<KandidatOutboundDto>;
    kandidatliste: Kandidatliste;
}

export interface LeggTilKandidaterFailureAction {
    type: KandidatlisteActionType.LeggTilKandidaterFailure;
}

export interface LeggTilKandidaterResetAction {
    type: KandidatlisteActionType.LeggTilKandidaterReset;
}

export interface LagreKandidatIKandidatlisteAction {
    type: KandidatlisteActionType.LagreKandidatIKandidatliste;
    kandidatliste: any;
    fodselsnummer: string;
    kandidatnr: string;
}

export interface LagreKandidatIKandidatlisteSuccessAction {
    type: KandidatlisteActionType.LagreKandidatIKandidatlisteSuccess;
}

export interface LagreKandidatIKandidatlisteFailureAction {
    type: KandidatlisteActionType.LagreKandidatIKandidatlisteFailure;
}

export interface FormidleUsynligKandidatAction {
    type: KandidatlisteActionType.FormidleUsynligKandidat;
    kandidatlisteId: string;
    formidling: FormidlingAvUsynligKandidatOutboundDto;
}

export interface FormidleUsynligKandidatSuccessAction {
    type: KandidatlisteActionType.FormidleUsynligKandidatSuccess;
    kandidatliste: Kandidatliste;
    formidling: FormidlingAvUsynligKandidatOutboundDto;
}

export interface FormidleUsynligKandidatFailureAction {
    type: KandidatlisteActionType.FormidleUsynligKandidatFailure;
    error: ApiError;
}

export interface EndreStatusKandidatAction {
    type: KandidatlisteActionType.EndreStatusKandidat;
    status: Kandidatstatus;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreStatusKandidatSuccessAction {
    type: KandidatlisteActionType.EndreStatusKandidatSuccess;
    kandidatliste: Kandidatliste;
}

export interface EndreStatusKandidatFailureAction {
    type: KandidatlisteActionType.EndreStatusKandidatFailure;
}

export interface EndreUtfallKandidatAction {
    type: KandidatlisteActionType.EndreUtfallKandidat;
    utfall: Kandidatutfall;
    navKontor: string;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface EndreUtfallKandidatSuccessAction {
    type: KandidatlisteActionType.EndreUtfallKandidatSuccess;
    kandidatliste: Kandidatliste;
}

export interface EndreUtfallKandidatFailureAction {
    type: KandidatlisteActionType.EndreUtfallKandidatFailure;
}

export interface EndreKandidatlistestatusAction {
    type: KandidatlisteActionType.EndreKandidatlistestatus;
    kandidatlisteId: string;
    status: Kandidatlistestatus;
}

export interface EndreKandidatlistestatusSuccessAction {
    type: KandidatlisteActionType.EndreKandidatlistestatusSuccess;
    kandidatliste: Kandidatliste;
}

export interface EndreKandidatlistestatusFailureAction {
    type: KandidatlisteActionType.EndreKandidatlistestatusFailure;
    error: SearchApiError;
}

export interface EndreFormidlingsutfallForUsynligKandidatAction {
    type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidat;
    formidlingId: string;
    utfall: Kandidatutfall;
    navKontor: string;
    kandidatlisteId: string;
}

export interface EndreFormidlingsutfallForUsynligKandidatSuccessAction {
    type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatSuccess;
    formidlingId: string;
    kandidatliste: Kandidatliste;
}

export interface EndreFormidlingsutfallForUsynligKandidatFailureAction {
    type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidatFailure;
    formidlingId: string;
    error: SearchApiError;
}

export interface SetFodselsnummerAction {
    type: KandidatlisteActionType.SetFodselsnummer;
    fodselsnummer: string;
}

export interface SetNotatAction {
    type: KandidatlisteActionType.SetNotat;
    notat: string;
}

export interface HentKandidatMedFnrAction {
    type: KandidatlisteActionType.HentKandidatMedFnr;
    fodselsnummer: string;
}

export interface HentKandidatMedFnrSuccessAction {
    type: KandidatlisteActionType.HentKandidatMedFnrSuccess;
    kandidat: CvSøkeresultat;
}

export interface HentKandidatMedFnrNotFoundAction {
    type: KandidatlisteActionType.HentKandidatMedFnrNotFound;
}

export interface HentKandidatMedFnrFailureAction {
    type: KandidatlisteActionType.HentKandidatMedFnrFailure;
}

export interface LeggTilKandidatSøkReset {
    type: KandidatlisteActionType.LeggTilKandidatSøkReset;
}

export interface HentUsynligKandidatAction {
    type: KandidatlisteActionType.HentUsynligKandidat;
    fodselsnummer: string;
}

export interface HentUsynligKandidatSuccessAction {
    type: KandidatlisteActionType.HentUsynligKandidatSuccess;
    navn: UsynligKandidat[];
}

export interface HentUsynligKandidatFailureAction {
    type: KandidatlisteActionType.HentUsynligKandidatFailure;
    error: ApiError;
}

export interface HentNotaterAction {
    type: KandidatlisteActionType.HentNotater;
    kandidatlisteId: string;
    kandidatnr: string;
}

export interface HentNotaterSuccessAction {
    type: KandidatlisteActionType.HentNotaterSuccess;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface HentNotaterFailureAction {
    type: KandidatlisteActionType.HentNotaterFailure;
}

export interface OpprettNotatAction {
    type: KandidatlisteActionType.OpprettNotat;
    kandidatlisteId: string;
    kandidatnr: string;
    tekst: string;
}

export interface OpprettNotatSuccessAction {
    type: KandidatlisteActionType.OpprettNotatSuccess;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface OpprettNotatFailureAction {
    type: KandidatlisteActionType.OpprettNotatFailure;
}

export interface HentKandidatlisteMedAnnonsenummerAction {
    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummer;
}

export interface HentKandidatlisteMedAnnonsenummerSuccessAction {
    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerSuccess;
    kandidatliste: Kandidatliste;
}

export interface HentKandidatlisteMedAnnonsenummerNotFoundAction {
    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerNotFound;
    message: string;
}

export interface HentKandidatlisteMedAnnonsenummerFailureAction {
    type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummerFailure;
}

export interface EndreNotatAction {
    type: KandidatlisteActionType.EndreNotat;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
    tekst: string;
}

export interface EndreNotatSuccessAction {
    type: KandidatlisteActionType.EndreNotatSuccess;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface EndreNotatFailureAction {
    type: KandidatlisteActionType.EndreNotatFailure;
}

export interface SlettNotatAction {
    type: KandidatlisteActionType.SlettNotat;
    kandidatlisteId: string;
    kandidatnr: string;
    notatId: string;
}

export interface SlettNotatSuccessAction {
    type: KandidatlisteActionType.SlettNotatSuccess;
    kandidatnr: string;
    notater: Array<Notat>;
}

export interface SlettNotatFailureAction {
    type: KandidatlisteActionType.SlettNotatFailure;
}

export interface ToggleArkivertAction {
    type: KandidatlisteActionType.ToggleArkivert;
    kandidatlisteId: string;
    kandidatnr: string;
    arkivert: boolean;
}

export interface ToggleArkivertSuccessAction {
    type: KandidatlisteActionType.ToggleArkivertSuccess;
    kandidat: Kandidat;
}

export interface ToggleArkivertFailureAction {
    type: KandidatlisteActionType.ToggleArkivertFailure;
}

export interface AngreArkiveringAction {
    type: KandidatlisteActionType.AngreArkivering;
    kandidatlisteId: string;
    kandidatnumre: string[];
}

export interface AngreArkiveringSuccessAction {
    type: KandidatlisteActionType.AngreArkiveringSuccess;
    kandidatnumre: string[];
}

export interface AngreArkiveringFailureAction {
    type: KandidatlisteActionType.AngreArkiveringFailure;
}

export interface VelgKandidatAction {
    type: KandidatlisteActionType.VelgKandidat;
    kandidatlisteId?: string;
    kandidatnr?: string;
}

export interface SendSmsAction {
    type: KandidatlisteActionType.SendSms;
    melding: string;
    fnr: string[];
    kandidatlisteId: string;
}

export interface SendSmsSuccessAction {
    type: KandidatlisteActionType.SendSmsSuccess;
}

export interface SendSmsFailureAction {
    type: KandidatlisteActionType.SendSmsFailure;
    error: SearchApiError;
}

export interface ResetSendSmsStatusAction {
    type: KandidatlisteActionType.ResetSendSmsStatus;
}

export interface HentSendteMeldingerAction {
    type: KandidatlisteActionType.HentSendteMeldinger;
    kandidatlisteId: string;
}

export interface HentSendteMeldingerSuccessAction {
    type: KandidatlisteActionType.HentSendteMeldingerSuccess;
    sendteMeldinger: Sms[];
}

export interface HentSendteMeldingerFailureAction {
    type: KandidatlisteActionType.HentSendteMeldingerFailure;
    error: SearchApiError;
}

export interface HentForespørslerOmDelingAvCvAction {
    type: KandidatlisteActionType.HentForespørslerOmDelingAvCv;
    stillingsId: string;
}

export interface HentForespørslerOmDelingAvCvSuccessAction {
    type: KandidatlisteActionType.HentForespørslerOmDelingAvCvSuccess;
    forespørslerOmDelingAvCv: Record<AktørId, ForespørselOmDelingAvCv[]>;
}

export interface HentForespørslerOmDelingAvCvFailureAction {
    type: KandidatlisteActionType.HentForespørslerOmDelingAvCvFailure;
    error: SearchApiError;
}

export interface SendForespørselOmDelingAvCv {
    type: KandidatlisteActionType.SendForespørselOmDelingAvCv;
    forespørselOutboundDto: ForespørselOutboundDto;
}

export interface SendForespørselOmDelingAvCvSuccess {
    type: KandidatlisteActionType.SendForespørselOmDelingAvCvSuccess;
    forespørslerOmDelingAvCv: Record<AktørId, ForespørselOmDelingAvCv[]>;
}

export interface SendForespørselOmDelingAvCvFailure {
    type: KandidatlisteActionType.SendForespørselOmDelingAvCvFailure;
    error: SearchApiError;
}

export interface ResetSendForespørselOmDelingAvCv {
    type: KandidatlisteActionType.ResetSendForespørselOmDelingAvCv;
}

export interface EndreKandidatlistefilterAction {
    type: KandidatlisteActionType.EndreKandidatlisteFilter;
    filter: Kandidatlistefilter;
}

export interface ToggleMarkeringAvKandidat {
    type: KandidatlisteActionType.ToggleMarkeringAvKandidat;
    kandidatnr: string;
}

export interface EndreMarkeringAvKandidaterAction {
    type: KandidatlisteActionType.EndreMarkeringAvKandidater;
    kandidatnumre: string[];
}

export interface EndreVisningsstatusKandidatAction {
    type: KandidatlisteActionType.EndreVisningsstatusKandidat;
    kandidatnr: string;
    visningsstatus: Visningsstatus;
}

export interface EndreSortering {
    type: KandidatlisteActionType.EndreSortering;
    sortering: Kandidatsortering;
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
    | FormidleUsynligKandidatAction
    | FormidleUsynligKandidatSuccessAction
    | FormidleUsynligKandidatFailureAction
    | EndreFormidlingsutfallForUsynligKandidatAction
    | EndreFormidlingsutfallForUsynligKandidatSuccessAction
    | EndreFormidlingsutfallForUsynligKandidatFailureAction
    | LeggTilKandidaterResetAction
    | EndreKandidatlistestatusAction
    | EndreKandidatlistestatusSuccessAction
    | EndreKandidatlistestatusFailureAction
    | HentForespørslerOmDelingAvCvAction
    | HentForespørslerOmDelingAvCvSuccessAction
    | HentForespørslerOmDelingAvCvFailureAction
    | SendForespørselOmDelingAvCv
    | SendForespørselOmDelingAvCvSuccess
    | SendForespørselOmDelingAvCvFailure
    | ResetSendForespørselOmDelingAvCv
    | EndreSortering;

export default KandidatlisteAction;
