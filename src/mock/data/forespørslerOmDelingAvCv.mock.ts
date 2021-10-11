import moment from 'moment';
import {
    ForespørselDeltStatus,
    ForespørselOmDelingAvCv,
    ForespørslerGruppertPåAktørId,
    IdentType,
    TilstandPåForespørsel,
} from '../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { kandidatliste, kandidatlister } from './kandidatliste.mock';
import { meg } from './veiledere.mock';
import { kandidatlisterForKandidatMock } from './kandidatlister-for-kandidat.mock';

export const forespørslerOmDelingAvCv: ForespørslerGruppertPåAktørId = {
    [kandidatlister[0].kandidater[0].aktørid!]: [
        {
            aktørId: kandidatlister[0].kandidater[0].aktørid!,
            stillingsId: kandidatliste.stillingId!,
            deltAv: meg.ident,
            deltTidspunkt: new Date().toISOString(),
            deltStatus: ForespørselDeltStatus.Sendt,
            svarfrist: moment().add(2, 'day').startOf('day').toISOString(),
            tilstand: TilstandPåForespørsel.KanIkkeOpprette,
            svar: null,
        },
    ],
    [kandidatlister[0].kandidater[2].aktørid!]: [
        {
            aktørId: kandidatlister[0].kandidater[2].aktørid!,
            stillingsId: kandidatliste.stillingId!,
            deltAv: meg.ident,
            deltTidspunkt: new Date().toISOString(),
            deltStatus: ForespørselDeltStatus.IkkeSendt,
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
    ],
};

export const forespørslerOmDelingAvCvForKandidat: ForespørselOmDelingAvCv[] = [
    {
        aktørId: kandidatlister[0].kandidater[0].aktørid!,
        stillingsId: kandidatlisterForKandidatMock[0].stillingId!,
        deltAv: meg.ident,
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
