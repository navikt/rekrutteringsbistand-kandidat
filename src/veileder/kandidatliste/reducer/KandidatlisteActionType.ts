enum KandidatlisteActionType {
    HENT_KANDIDATLISTE_MED_STILLINGS_ID = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID',
    HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS',
    HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE',
    HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID',
    HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS',
    HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE',
    OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE',
    OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS',
    OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE',
    OPPDATER_KANDIDATLISTE = 'OPPDATER_KANDIDATLISTE_BEGIN',
    OPPDATER_KANDIDATLISTE_SUCCESS = 'OPPDATER_KANDIDATLISTE_SUCCESS',
    OPPDATER_KANDIDATLISTE_FAILURE = 'OPPDATER_KANDIDATLISTE_FAILURE',
    RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS',
    PRESENTER_KANDIDATER = 'PRESENTER_KANDIDATER',
    PRESENTER_KANDIDATER_SUCCESS = 'PRESENTER_KANDIDATER_SUCCESS',
    PRESENTER_KANDIDATER_FAILURE = 'PRESENTER_KANDIDATER_FAILURE',
    RESET_DELESTATUS = 'RESET_DELESTATUS',
    LEGG_TIL_KANDIDATER = 'LEGG_TIL_KANDIDATER',
    LEGG_TIL_KANDIDATER_SUCCESS = 'LEGG_TIL_KANDIDATER_SUCCESS',
    LEGG_TIL_KANDIDATER_FAILURE = 'LEGG_TIL_KANDIDATER_FAILURE',
    LAGRE_KANDIDAT_I_KANDIDATLISTE = 'LAGRE_KANDIDAT_I_KANDIDATLISTE',
    LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS',
    LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE',
    ENDRE_STATUS_KANDIDAT = 'ENDRE_STATUS_KANDIDAT',
    ENDRE_STATUS_KANDIDAT_SUCCESS = 'ENDRE_STATUS_KANDIDAT_SUCCESS',
    ENDRE_STATUS_KANDIDAT_FAILURE = 'ENDRE_STATUS_KANDIDAT_FAILURE',
    ENDRE_UTFALL_KANDIDAT = 'ENDRE_UTFALL_KANDIDAT',
    ENDRE_UTFALL_KANDIDAT_SUCCESS = 'ENDRE_UTFALL_KANDIDAT_SUCCESS',
    ENDRE_UTFALL_KANDIDAT_FAILURE = 'ENDRE_UTFALL_KANDIDAT_FAILURE',
    SET_FODSELSNUMMER = 'SET_FODSELSNUMMER',
    SET_NOTAT = 'SET_NOTAT',
    HENT_KANDIDAT_MED_FNR = 'HENT_KANDIDAT_MED_FNR',
    HENT_KANDIDAT_MED_FNR_SUCCESS = 'HENT_KANDIDAT_MED_FNR_SUCCESS',
    HENT_KANDIDAT_MED_FNR_NOT_FOUND = 'HENT_KANDIDAT_MED_FNR_NOT_FOUND',
    HENT_KANDIDAT_MED_FNR_FAILURE = 'HENT_KANDIDAT_MED_FNR_FAILURE',
    HENT_KANDIDAT_MED_FNR_RESET = 'HENT_KANDIDAT_MED_FNR_RESET',
    HENT_USYNLIG_KANDIDAT = 'HENT_USYNLIG_KANDIDAT',
    HENT_USYNLIG_KANDIDAT_SUCCESS = 'HENT_USYNLIG_KANDIDAT_SUCCESS',
    HENT_USYNLIG_KANDIDAT_FAILURE = 'HENT_USYNLIG_KANDIDAT_FAILURE',
    HENT_NOTATER = 'HENT_NOTATER',
    HENT_NOTATER_SUCCESS = 'HENT_NOTATER_SUCCESS',
    HENT_NOTATER_FAILURE = 'HENT_NOTATER_FAILURE',
    OPPRETT_NOTAT = 'OPPRETT_NOTAT',
    OPPRETT_NOTAT_SUCCESS = 'OPPRETT_NOTAT_SUCCESS',
    OPPRETT_NOTAT_FAILURE = 'OPPRETT_NOTAT_FAILURE',
    HENT_KANDIDATLISTE_MED_ANNONSENUMMER = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER',
    HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS',
    HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND',
    HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE',
    ENDRE_NOTAT = 'ENDRE_NOTAT',
    ENDRE_NOTAT_SUCCESS = 'ENDRE_NOTAT_SUCCESS',
    ENDRE_NOTAT_FAILURE = 'ENDRE_NOTAT_FAILURE',
    SLETT_NOTAT = 'SLETT_NOTAT',
    SLETT_NOTAT_SUCCESS = 'SLETT_NOTAT_SUCCESS',
    SLETT_NOTAT_FAILURE = 'SLETT_NOTAT_FAILURE',
    TOGGLE_ARKIVERT = 'TOGGLE_ARKIVERT',
    TOGGLE_ARKIVERT_SUCCESS = 'TOGGLE_ARKIVERT_SUCCESS',
    TOGGLE_ARKIVERT_FAILURE = 'TOGGLE_ARKIVERT_FAILURE',
    ANGRE_ARKIVERING = 'ANGRE_ARKIVERING',
    ANGRE_ARKIVERING_SUCCESS = 'ANGRE_ARKIVERING_SUCCESS',
    ANGRE_ARKIVERING_FAILURE = 'ANGRE_ARKIVERING_FAILURE',
    SEND_SMS = 'SEND_SMS',
    SEND_SMS_SUCCESS = 'SEND_SMS_SUCCESS',
    SEND_SMS_FAILURE = 'SEND_SMS_FAILURE',
    RESET_SEND_SMS_STATUS = 'RESET_SEND_SMS_STATUS',
    HENT_SENDTE_MELDINGER = 'HENT_SENDTE_MELDINGER',
    HENT_SENDTE_MELDINGER_SUCCESS = 'HENT_SENDTE_MELDINGER_SUCCESS',
    HENT_SENDTE_MELDINGER_FAILURE = 'HENT_SENDTE_MELDINGER_FAILURE',
    VELG_KANDIDAT = 'VELG_KANDIDAT',
    ENDRE_KANDIDATLISTE_FILTER = 'ENDRE_KANDIDATLISTE_FILTER',
    TOGGLE_MARKERING_AV_KANDIDAT = 'TOGGLE_MARKERING_AV_KANDIDAT',
    ENDRE_MARKERING_AV_KANDIDATER = 'ENDRE_MARKERING_AV_KANDIDATER',
    ENDRE_VISNINGSSTATUS_KANDIDAT = 'ENDRE_VISNINGSSTATUS_KANDIDAT',
}

export default KandidatlisteActionType;
