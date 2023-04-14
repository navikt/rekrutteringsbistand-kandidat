import { Kandidat } from '../kandidatliste/domene/Kandidat';
import { mockCver } from './data/kandidat/cv.mock';
import {
    kandidatlistesammendragLister,
    mockKandidatlister,
    mockUsynligKandidat,
} from './data/kandidat/kandidatliste.mock';
import { kandidatlisterForKandidatMock } from './data/kandidat/kandidatlister-for-kandidat.mock';
import { enAnnenVeileder, meg } from './data/kandidat/veileder.mock';
import sms from './data/sms/sms.mock.json';

import stilling from './data/stillingssøk/stilling.mock.json';
import annenStilling from './data/stillingssøk/annen-stilling.mock.json';
import {
    mockForespørslerOmDelingAvCv,
    mockForespørslerOmDelingAvCvForKandidat,
} from './data/forespørselOmDelingAvCv/forespørselOmDelingAvCv.mock';
import enhetsregister from './data/kandidat/enhetsregister.mock.json';
import notater from './data/kandidat/notater.mock.json';
import kandidatlisteBasertPåAnnonsenummer from './data/kandidat/kandidatlisteBasertPåAnnonsenummer.mock.json';

const cver = mockCver(meg);
const kandidatlister = mockKandidatlister(meg, enAnnenVeileder, cver);
const kandidatliste = kandidatlister[0];
const kandidatlisterForKandidat = kandidatlisterForKandidatMock(meg);
const kandidatlisteForKandidat = kandidatlisterForKandidat[0];
const kandidat = (index?: number): Kandidat => kandidatliste.kandidater[index || 0]!!;
const usynligKandidat = mockUsynligKandidat(cver[7], meg);

export const mock = {
    kandidat: {
        cver: mockCver(meg),
        kandidatlister,
        kandidatliste: kandidatlister[0],
        kandidatlisteBasertPåAnnonsenummer,
        kandidat,
        kandidatlisterForKandidat,
        kandidatlisteForKandidat,
        kandidatlistesammendrag: kandidatlistesammendragLister(kandidatlister),
        enhetsregister,
        notater,
    },
    sms: {
        sms: sms as any,
    },
    forespørselOmDelingAvCv: {
        forespørslerOmDelingAvCv: mockForespørslerOmDelingAvCv(meg, kandidatliste),
        forespørslerOmDelingAvCvForKandidat: mockForespørslerOmDelingAvCvForKandidat(
            meg,
            kandidat().aktørid!,
            kandidatlisteForKandidat
        ),
    },
    synlighet: {
        usynligKandidat,
    },
    stillingssøk: {
        stilling: stilling as any,
        annenStilling: annenStilling as any,
    },
};
