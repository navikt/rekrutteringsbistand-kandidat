import { Tilgjengelighet, Innsatsgruppe } from '../../kandidatsøk/kandidater-tabell/Søkeresultat';
import cver, { antall } from './cv.mock';
import Søkeresultat from '../../kandidatsøk/kandidater-tabell/Søkeresultat';

const resultater: Søkeresultat[] = cver.map((cv) => ({
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
    hoyesteUtdanning: cv.utdanning[0],
    mestRelevanteYrkeserfaring: cv.yrkeserfaring[0],
    servicebehov: 'Varig tilpasset innsats',
    innsatsgruppe: Innsatsgruppe.Standard,
    midlertidigUtilgjengeligStatus: Tilgjengelighet.Tilgjengelig, // TODO: Dynamisk midl.util.
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
