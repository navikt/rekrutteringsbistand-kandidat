enum KandidatlisteActionType {
    HentKandidatlisteMedStillingsId = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID',
    HentKandidatlisteMedStillingsIdSuccess = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS',
    HentKandidatlisteMedStillingsIdFailure = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE',
    HentKandidatlisteMedKandidatlisteId = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID',
    HentKandidatlisteMedKandidatlisteIdSuccess = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS',
    HentKandidatlisteMedKandidatlisteIdFailure = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE',
    OpprettKandidatliste = 'OPPRETT_KANDIDATLISTE',
    OpprettKandidatlisteSuccess = 'OPPRETT_KANDIDATLISTE_SUCCESS',
    OpprettKandidatlisteFailure = 'OPPRETT_KANDIDATLISTE_FAILURE',
    OppdaterKandidatliste = 'OPPDATER_KANDIDATLISTE_BEGIN',
    OppdaterKandidatlisteSuccess = 'OPPDATER_KANDIDATLISTE_SUCCESS',
    OppdaterKandidatlisteFailure = 'OPPDATER_KANDIDATLISTE_FAILURE',
    ResetLagreStatus = 'RESET_LAGRE_STATUS',
    PresenterKandidater = 'PRESENTER_KANDIDATER',
    PresenterKandidaterSuccess = 'PRESENTER_KANDIDATER_SUCCESS',
    PresenterKandidaterFailure = 'PRESENTER_KANDIDATER_FAILURE',
    ResetDelestatus = 'RESET_DELESTATUS',
    LeggTilKandidater = 'LEGG_TIL_KANDIDATER',
    LeggTilKandidaterSuccess = 'LEGG_TIL_KANDIDATER_SUCCESS',
    LeggTilKandidaterFailure = 'LEGG_TIL_KANDIDATER_FAILURE',
    LeggTilKandidaterReset = 'LEGG_TIL_KANDIDATER_RESET',
    LagreKandidatIKandidatliste = 'LAGRE_KANDIDAT_I_KANDIDATLISTE',
    LagreKandidatIKandidatlisteSuccess = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS',
    LagreKandidatIKandidatlisteFailure = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE',
    FormidleUsynligKandidatSuccess = 'FORMIDLE_USYNLIG_KANDIDAT_SUCCESS',
    EndreStatusKandidat = 'ENDRE_STATUS_KANDIDAT',
    EndreStatusKandidatSuccess = 'ENDRE_STATUS_KANDIDAT_SUCCESS',
    EndreStatusKandidatFailure = 'ENDRE_STATUS_KANDIDAT_FAILURE',
    EndreUtfallKandidat = 'ENDRE_UTFALL_KANDIDAT',
    EndreUtfallKandidatSuccess = 'ENDRE_UTFALL_KANDIDAT_SUCCESS',
    EndreUtfallKandidatFailure = 'ENDRE_UTFALL_KANDIDAT_FAILURE',
    EndreFormidlingsutfallForUsynligKandidat = 'ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT',
    EndreFormidlingsutfallForUsynligKandidatSuccess = 'ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT_SUCCESS',
    EndreFormidlingsutfallForUsynligKandidatFailure = 'ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT_FAILURE',
    SetFodselsnummer = 'SET_FODSELSNUMMER',
    SetNotat = 'SET_NOTAT',
    HentNotater = 'HENT_NOTATER',
    HentNotaterSuccess = 'HENT_NOTATER_SUCCESS',
    HentNotaterFailure = 'HENT_NOTATER_FAILURE',
    OpprettNotat = 'OPPRETT_NOTAT',
    OpprettNotatSuccess = 'OPPRETT_NOTAT_SUCCESS',
    OpprettNotatFailure = 'OPPRETT_NOTAT_FAILURE',
    HentKandidatlisteMedAnnonsenummer = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER',
    HentKandidatlisteMedAnnonsenummerSuccess = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS',
    HentKandidatlisteMedAnnonsenummerNotFound = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND',
    HentKandidatlisteMedAnnonsenummerFailure = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE',
    EndreNotat = 'ENDRE_NOTAT',
    EndreNotatSuccess = 'ENDRE_NOTAT_SUCCESS',
    EndreNotatFailure = 'ENDRE_NOTAT_FAILURE',
    SlettNotat = 'SLETT_NOTAT',
    SlettNotatSuccess = 'SLETT_NOTAT_SUCCESS',
    SlettNotatFailure = 'SLETT_NOTAT_FAILURE',
    ToggleArkivert = 'TOGGLE_ARKIVERT',
    ToggleArkivertSuccess = 'TOGGLE_ARKIVERT_SUCCESS',
    ToggleArkivertFailure = 'TOGGLE_ARKIVERT_FAILURE',
    AngreArkivering = 'ANGRE_ARKIVERING',
    AngreArkiveringSuccess = 'ANGRE_ARKIVERING_SUCCESS',
    AngreArkiveringFailure = 'ANGRE_ARKIVERING_FAILURE',
    SendSms = 'SEND_SMS',
    SendSmsSuccess = 'SEND_SMS_SUCCESS',
    SendSmsFailure = 'SEND_SMS_FAILURE',
    ResetSendSmsStatus = 'RESET_SEND_SMS_STATUS',
    HentSendteMeldinger = 'HENT_SENDTE_MELDINGER',
    HentSendteMeldingerSuccess = 'HENT_SENDTE_MELDINGER_SUCCESS',
    HentSendteMeldingerFailure = 'HENT_SENDTE_MELDINGER_FAILURE',
    VelgKandidat = 'VELG_KANDIDAT',
    EndreKandidatlisteFilter = 'ENDRE_KANDIDATLISTE_FILTER',
    ToggleMarkeringAvKandidat = 'TOGGLE_MARKERING_AV_KANDIDAT',
    EndreMarkeringAvKandidater = 'ENDRE_MARKERING_AV_KANDIDATER',
    EndreVisningsstatusKandidat = 'ENDRE_VISNINGSSTATUS_KANDIDAT',
    EndreKandidatlistestatus = 'ENDRE_KANDIDATLISTESTATUS',
    EndreKandidatlistestatusSuccess = 'ENDRE_KANDIDATLISTESTATUS_SUCCESS',
    EndreKandidatlistestatusFailure = 'ENDRE_KANDIDATLISTESTATUS_FAILURE',
    HentForespørslerOmDelingAvCv = 'HENT_FORESPØRSLER_OM_DELING_AV_CV',
    HentForespørslerOmDelingAvCvSuccess = 'HENT_FORESPØRSLER_OM_DELING_AV_CV_SUCCESS',
    HentForespørslerOmDelingAvCvFailure = 'HENT_FORESPØRSLER_OM_DELING_AV_CV_FAILURE',
    SendForespørselOmDelingAvCv = 'SEND_FORESPØRSEL_OM_DELING_AV_CV',
    SendForespørselOmDelingAvCvSuccess = 'SEND_FORESPØRSEL_OM_DELING_AV_CV_SUCCESS',
    SendForespørselOmDelingAvCvFailure = 'SEND_FORESPØRSEL_OM_DELING_AV_CV_FAILURE',
    ResetSendForespørselOmDelingAvCv = 'RESET_SEND_FORESPØRSEL_OM_DELING_AV_CV',
    ResendForespørselOmDelingAvCvSuccess = 'RESEND_FORESPØRSEL_OM_DELING_AV_CV_SUCCESS',
    EndreSortering = 'ENDRE_SORTERING',
}

export default KandidatlisteActionType;
