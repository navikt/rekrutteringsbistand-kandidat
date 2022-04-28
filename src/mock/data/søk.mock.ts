import cver, { antall } from './cv.mock';
import Cv, { CvSøkeresultat, Innsatsgruppe } from '../../kandidatside/cv/reducer/cv-typer';

const resultater: CvSøkeresultat[] = cver.map((cv: Cv) => ({
    aktorId: cv.aktorId,
    arenaKandidatnr: cv.kandidatnummer,
    fornavn: cv.fornavn,
    etternavn: cv.etternavn,
    fodselsdato: cv.fodselsdato,
    fodselsnummer: cv.fodselsnummer,
    erFodselsdatoDnr: false,
    totalLengdeYrkeserfaring: 100,
    erLagtTilKandidatliste: false,
    score: 'NaN',
    poststed: cv.adresse.poststednavn,
    hoyesteUtdanning: {
        nusKode: cv.utdanning[0].nusKode,
        nusKodeGrad: cv.utdanning[0].nusKodeGrad,
    },
    servicebehov: 'Varig tilpasset innsats',
    innsatsgruppe: Innsatsgruppe.Standard,
}));

const kompetanseAggregeringerFelt = [
    {
        feltnavn: 'Butikkarbeid',
        antall: 1698,
        subfelt: [],
    },
    {
        feltnavn: 'Salg',
        antall: 1081,
        subfelt: [],
    },
    {
        feltnavn: 'Butikkledelse',
        antall: 925,
        subfelt: [],
    },
];

const søk = {
    totaltAntallTreff: antall,
    kandidater: resultater,
    aggregeringer: [
        { navn: 'listefyll', felt: [] },
        { navn: 'kompetanse', felt: kompetanseAggregeringerFelt },
    ],
};

export default søk;
