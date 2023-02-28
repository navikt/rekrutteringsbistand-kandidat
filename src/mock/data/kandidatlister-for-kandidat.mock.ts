import { Kandidatstatus, Kandidatutfall } from '../../kandidatliste/domene/Kandidat';
import { KandidatlisteForKandidat } from '../../kandidatside/historikk/historikkReducer';
import { Veileder } from './veileder';

const kandidatlisteId = 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29';
const kandidatlisteId2 = '53d32269-08df-4950-a4f9-41ad6f36129f';
const kandidatlisteId3 = '33d32269-08df-4950-a4f9-41ad6f36129f';
const kandidatlisteId4 = '43d32269-08df-4950-a4f9-41ad6f36129f';
const stillingsId = 'ce3da214-8771-4115-9362-b83145150551';
const stillingsId2 = 'be3da214-8771-4115-9362-b83145150551';

export const kandidatlisterForKandidatMock = (eier: Veileder): KandidatlisteForKandidat[] => [
    {
        uuid: kandidatlisteId,
        lagtTilTidspunkt: '2020-05-18T15:05:53.147',
        tittel: 'test',
        kandidatnr: 'CD430805',
        utfall: Kandidatutfall.IkkePresentert,
        status: Kandidatstatus.Vurderes,
        fornavn: 'OLA',
        etternavn: 'NORDMANN',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
        organisasjonReferanse: '215225111',
        organisasjonNavn: 'EN DYR BEDRIFT AS',
        stillingId: stillingsId,
        slettet: false,
        antallStillinger: 4,
        utfallsendringer: [],
    },
    {
        uuid: kandidatlisteId2,
        lagtTilTidspunkt: '2020-05-19T17:01:39.147',
        tittel: 'Stillingsliste til stillingen min',
        kandidatnr: 'FK185344',
        utfall: Kandidatutfall.Presentert,
        status: Kandidatstatus.Vurderes,
        fornavn: 'Olas Gamle',
        etternavn: 'Navn',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
        slettet: false,
        utfallsendringer: [
            {
                registrertAvIdent: eier.ident,
                tidspunkt: new Date().toISOString(),
                utfall: Kandidatutfall.Presentert,
                sendtTilArbeidsgiversKandidatliste: true,
            },
        ],
    },

    {
        uuid: 'uuid3',
        lagtTilTidspunkt: '2020-01-19T17:01:39.147',
        tittel: 'Liste til gammel jobbmesse',
        kandidatnr: 'FZ856234',
        utfall: Kandidatutfall.Presentert,
        status: Kandidatstatus.Uinteressert,
        fornavn: 'Olas Gamle',
        etternavn: 'Navn',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z120687',
        slettet: true,
        utfallsendringer: [
            {
                registrertAvIdent: eier.ident,
                tidspunkt: new Date().toISOString(),
                utfall: Kandidatutfall.Presentert,
                sendtTilArbeidsgiversKandidatliste: true,
            },
            {
                registrertAvIdent: eier.ident,
                tidspunkt: new Date().toISOString(),
                utfall: Kandidatutfall.FåttJobben,
                sendtTilArbeidsgiversKandidatliste: false,
            },
        ],
    },

    {
        uuid: kandidatlisteId3,
        lagtTilTidspunkt: '2021-05-18T15:05:53.147',
        tittel: 'smstest',
        kandidatnr: 'CD430805',
        utfall: Kandidatutfall.IkkePresentert,
        status: Kandidatstatus.Kontaktet,
        fornavn: 'OLA',
        etternavn: 'NORDMANN',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
        organisasjonReferanse: '215225111',
        organisasjonNavn: 'EN DYR BEDRIFT AS',
        stillingId: stillingsId2,
        slettet: false,
        antallStillinger: 4,
        utfallsendringer: [],
    },
    {
        uuid: kandidatlisteId4,
        lagtTilTidspunkt: '2021-05-18T15:05:53.147',
        tittel: 'smstest2',
        kandidatnr: 'CD430805',
        utfall: Kandidatutfall.IkkePresentert,
        status: Kandidatstatus.Kontaktet,
        fornavn: 'OLA',
        etternavn: 'NORDMANN',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
        organisasjonReferanse: '215225111',
        organisasjonNavn: 'EN DYR BEDRIFT AS',
        stillingId: stillingsId2,
        slettet: false,
        antallStillinger: 4,
        utfallsendringer: [],
    },
];
