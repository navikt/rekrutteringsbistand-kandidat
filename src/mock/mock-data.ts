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
    cver: Cv[];
    kandidatlister: Kandidatliste[];
    kandidatliste: Kandidatliste;
    kandidat: (index: number) => Kandidat;
    usynligKandidat: UsynligKandidat;
    kandidatlisterForKandidat: KandidatlisteForKandidat[];
    kandidatlisteForKandidat: KandidatlisteForKandidat;
    kandidatlistesammendrag: KandidatlisteSammendrag[];
    forespørselOmDelingAvCv: Record<AktørId, ForespørselOmDelingAvCv[]>;
    forespørselOmDelingAvCvForKandidat: ForespørselOmDelingAvCv[];
    stilling: any;
    annenStilling: any;
};

export const mock: Mock = {
    cver: mockCver(meg),
    kandidatlister,
    kandidatliste: kandidatlister[0],
    kandidat,
    usynligKandidat,
    kandidatlisterForKandidat,
    kandidatlisteForKandidat,
    kandidatlistesammendrag: kandidatlistesammendragLister(kandidatlister),
    forespørselOmDelingAvCv: mocketForespørslerOmDelingAvCv(meg, kandidatliste),
    forespørselOmDelingAvCvForKandidat: mocketForespørslerOmDelingAvCvForKandidat(
        meg,
        kandidat().aktørid!,
        kandidatlisteForKandidat
    ),

    stilling,
    annenStilling,
};
