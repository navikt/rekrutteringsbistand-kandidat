import { KandidatlisteForKandidat } from '../kandidatside/historikk/historikkReducer';
import { Utfall } from '../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import { Status } from '../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';

const kandidatlisteId = 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29';
const kandidatlisteId2 = '53d32269-08df-4950-a4f9-41ad6f36129f';
const stillingsId = 'ce3da214-8771-4115-9362-b83145150551';

export const kandidatlisterForKandidatMock: KandidatlisteForKandidat[] = [
    {
        uuid: kandidatlisteId,
        lagtTilTidspunkt: '2020-05-18T15:05:53.147',
        tittel: 'test',
        kandidatnr: 'CD430805',
        utfall: Utfall.IkkePresentert,
        status: Status.Vurderes,
        fornavn: 'OLA',
        etternavn: 'NORDMANN',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
        organisasjonReferanse: '215225111',
        organisasjonNavn: 'EN DYR BEDRIFT AS',
        stillingId: stillingsId,
        slettet: false,
    },
    {
        uuid: kandidatlisteId2,
        lagtTilTidspunkt: '2020-05-19T17:01:39.147',
        tittel: 'Stillingsliste til stillingen min',
        kandidatnr: 'FK185344',
        utfall: Utfall.Presentert,
        status: Status.Vurderes,
        fornavn: 'kurt',
        etternavn: 'helmer',
        lagtTilAvEpost: 'clark.kent@nav.no',
        lagtTilAvNavn: 'Clark Kent',
        lagtTilAvIdent: 'Z990746',
    },
];
