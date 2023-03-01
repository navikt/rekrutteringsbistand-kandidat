import { AktørId, Kandidat, UsynligKandidat } from '../kandidatliste/domene/Kandidat';
import { mockCver } from './data/cv.mock';
import {
    kandidatlistesammendragLister,
    mocketForespørslerOmDelingAvCv,
    mocketForespørslerOmDelingAvCvForKandidat,
    mockKandidatlister,
    mockUsynligKandidat,
} from './data/kandidatliste.mock';
import { kandidatlisterForKandidatMock } from './data/kandidatlister-for-kandidat.mock';
import { enAnnenVeileder, meg } from './data/veileder';

import stilling from './data/stilling.mock.json';
import annenStilling from './data/annen-stilling.mock.json';
import Cv from '../kandidatside/cv/reducer/cv-typer';
import { Kandidatliste, KandidatlisteSammendrag } from '../kandidatliste/domene/Kandidatliste';
import { KandidatlisteForKandidat } from '../kandidatside/historikk/historikkReducer';
import { ForespørselOmDelingAvCv } from '../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

const cver = mockCver(meg);
const kandidatlister = mockKandidatlister(meg, enAnnenVeileder, cver);
const kandidatliste = kandidatlister[0];
const kandidatlisterForKandidat = kandidatlisterForKandidatMock(meg);
const kandidatlisteForKandidat = kandidatlisterForKandidat[0];
const kandidat = (index?: number): Kandidat => kandidatliste.kandidater[index || 0]!!;
const usynligKandidat = mockUsynligKandidat(cver[7], meg);

type Mock = {
    kandidat: {
        cver: Cv[];
        kandidatlister: Kandidatliste[];
        kandidatliste: Kandidatliste;
        kandidat: (index: number) => Kandidat;
        kandidatlisterForKandidat: KandidatlisteForKandidat[];
        kandidatlisteForKandidat: KandidatlisteForKandidat;
        kandidatlistesammendrag: KandidatlisteSammendrag[];
    };
    sms: {};
    forespørselOmDelingAvCv: {
        forespørslerOmDelingAvCv: Record<AktørId, ForespørselOmDelingAvCv[]>;
        forespørslerOmDelingAvCvForKandidat: ForespørselOmDelingAvCv[];
    };
    kandidatmatch: {};
    synlighet: {
        usynligKandidat: UsynligKandidat;
    };
    stillingssøk: {
        stilling: any;
        annenStilling: any;
    };
};

export const mock: Mock = {
    kandidat: {
        cver: mockCver(meg),
        kandidatlister,
        kandidatliste: kandidatlister[0],
        kandidat,
        kandidatlisterForKandidat,
        kandidatlisteForKandidat,
        kandidatlistesammendrag: kandidatlistesammendragLister(kandidatlister),
    },
    sms: {},
    forespørselOmDelingAvCv: {
        forespørslerOmDelingAvCv: mocketForespørslerOmDelingAvCv(meg, kandidatliste),
        forespørslerOmDelingAvCvForKandidat: mocketForespørslerOmDelingAvCvForKandidat(
            meg,
            kandidat().aktørid!,
            kandidatlisteForKandidat
        ),
    },
    kandidatmatch: {},
    synlighet: {
        usynligKandidat,
    },
    stillingssøk: {
        stilling,
        annenStilling,
    },
};
