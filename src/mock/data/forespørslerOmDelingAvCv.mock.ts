import moment from 'moment';
import {
    ForespørselDeltStatus,
    ForespørselOmDelingAvCv,
    IdentType,
    TilstandPåForespørsel,
} from '../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { kandidatliste, kandidatlister } from './kandidatliste.mock';
import { meg } from './veiledere.mock';
import { kandidatlisterForKandidatMock } from './kandidatlister-for-kandidat.mock';
import { AktørId } from '../../kandidatliste/domene/Kandidat';

export const forespørslerOmDelingAvCv: Record<AktørId, ForespørselOmDelingAvCv[]> = {
    [kandidatlister[0].kandidater[2].aktørid!]: [
        {
            aktørId: kandidatlister[0].kandidater[2].aktørid!,
            stillingsId: kandidatliste.stillingId!,
            deltAv: meg.ident,
            navKontor: meg.navKontor,
            deltTidspunkt: moment().subtract(10, 'day').toISOString(),
            deltStatus: ForespørselDeltStatus.Sendt,
            svarfrist: moment().add(5, 'day').startOf('day').subtract(2, 'hours').toISOString(),
            tilstand: TilstandPåForespørsel.HarSvart,
            svar: {
                harSvartJa: false,
                svarTidspunkt: moment().add(1, 'day').startOf('day').toISOString(),
                svartAv: {
                    ident: kandidatlister[0].kandidater[2].aktørid!,
                    identType: IdentType.AktørId,
                },
            },
        },
    ],
};

export const forespørslerOmDelingAvCvForKandidat: ForespørselOmDelingAvCv[] = [
    {
        aktørId: kandidatlister[0].kandidater[0].aktørid!,
        stillingsId: kandidatlisterForKandidatMock[0].stillingId!,
        deltAv: meg.ident,
        navKontor: meg.navKontor,
        deltTidspunkt: new Date().toISOString(),
        deltStatus: ForespørselDeltStatus.Sendt,
        svarfrist: moment().add(2, 'day').startOf('day').toISOString(),
        tilstand: TilstandPåForespørsel.HarSvart,
        svar: {
            harSvartJa: true,
            svarTidspunkt: moment().add(1, 'day').startOf('day').toISOString(),
            svartAv: {
                ident: kandidatlister[0].kandidater[2].aktørid!,
                identType: IdentType.AktørId,
            },
        },
    },
];
