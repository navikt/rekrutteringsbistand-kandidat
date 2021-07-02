import moment from 'moment';
import {
    ForespørselDeltStatus,
    ForespørselInboundDto,
    SvarPåDelingAvCv,
} from '../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { kandidatlister } from './kandidatliste.mock';
import { meg } from './veiledere.mock';

export const forespørslerOmDelingAvCv: ForespørselInboundDto[] = [
    {
        aktørId: kandidatlister[0].kandidater[0].aktørid!,
        deltAv: meg.ident,
        deltTidspunkt: new Date(),
        deltStatus: ForespørselDeltStatus.IkkeSendt,
        svar: SvarPåDelingAvCv.IkkeSvart,
        svarfrist: moment().add(3, 'days').startOf('day').toDate(),
        svarTidspunkt: null,
    },
];
