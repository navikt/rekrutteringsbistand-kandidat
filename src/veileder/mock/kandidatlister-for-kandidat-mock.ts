import { KandidatlisteForKandidat } from '../kandidatside/historikk/historikkType';
import { Utfall } from '../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import { Status } from '../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';

export const kandidatlisterForKandidatMock: KandidatlisteForKandidat[] = [
    {
        uuid: "16483b0c-0c9f-43d2-a0d6-8ac0cae8ec6a",
        lagtTilTidspunkt: "2020-05-18T15:05:53.147",
        tittel: "test",
        kandidatnr: "OJKWDHAD",
        utfall: Utfall.IkkePresentert,
        status: Status.Vurderes,
        fornavn: "OLA",
        etternavn: "NORDMANN",
        lagtTilAvEpost: "clark.kent@nav.no",
        lagtTilAvNavn: "Clark Kent",
        lagtTilAvIdent: "Z990746",
    }
];
