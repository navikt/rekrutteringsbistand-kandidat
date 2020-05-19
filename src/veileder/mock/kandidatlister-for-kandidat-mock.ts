import { KandidatlisteForKandidat } from '../kandidatside/historikk/historikkReducer';
import { Utfall } from '../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import { Status } from '../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';

export const kandidatlisterForKandidatMock: KandidatlisteForKandidat[] = [
    {
        uuid: '16483b0c-0c9f-43d2-a0d6-8ac0cae8ec6a',
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
    },
    {
        uuid: 'f18d323b-d965-4643-bc81-518ed0a15f3c',
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
