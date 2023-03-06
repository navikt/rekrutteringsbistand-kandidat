import moment from 'moment';
import { AktørId } from '../../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../../kandidatliste/domene/Kandidatliste';
import {
    ForespørselOmDelingAvCv,
    ForespørselDeltStatus,
    TilstandPåForespørsel,
    IdentType,
} from '../../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { KandidatlisteForKandidat } from '../../../historikk/historikkReducer';
import { Veileder } from '../kandidat/veileder.mock';

export const mockForespørslerOmDelingAvCv = (
    eier: Veileder,
    kandidatliste: Kandidatliste
): Record<AktørId, ForespørselOmDelingAvCv[]> => ({
    [kandidatliste.kandidater[5].aktørid!!]: [
        {
            aktørId: kandidatliste.kandidater[5].aktørid!!,
            stillingsId: kandidatliste.stillingId!,
            deltAv: eier.ident,
            navKontor: eier.navKontor,
            deltTidspunkt: moment().subtract(10, 'day').toISOString(),
            deltStatus: ForespørselDeltStatus.Sendt,
            svarfrist: moment().add(5, 'day').startOf('day').subtract(2, 'hours').toISOString(),
            tilstand: TilstandPåForespørsel.HarSvart,
            svar: {
                harSvartJa: true,
                svarTidspunkt: moment().subtract(1, 'day').startOf('day').toISOString(),
                svartAv: {
                    ident: eier.ident,
                    identType: IdentType.NavIdent,
                },
            },
        },
    ],
});

export const mockForespørslerOmDelingAvCvForKandidat = (
    eier: Veileder,
    aktørId: string,
    kandidatlisteForKandidat: KandidatlisteForKandidat
): ForespørselOmDelingAvCv[] => [
    {
        aktørId,
        stillingsId: kandidatlisteForKandidat.stillingId!,
        deltAv: eier.ident,
        navKontor: eier.navKontor,
        deltTidspunkt: new Date().toISOString(),
        deltStatus: ForespørselDeltStatus.Sendt,
        svarfrist: moment().add(2, 'day').startOf('day').toISOString(),
        tilstand: TilstandPåForespørsel.HarSvart,
        svar: {
            harSvartJa: true,
            svarTidspunkt: moment().add(1, 'day').startOf('day').toISOString(),
            svartAv: {
                ident: aktørId,
                identType: IdentType.AktørId,
            },
        },
    },
];
