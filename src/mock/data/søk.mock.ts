import { Tilgjengelighet, Innsatsgruppe } from '../../sok/Søkeresultat';
import cver, { antall } from './cv.mock';
import Søkeresultat from '../../sok/Søkeresultat';

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

const søk = {
    totaltAntallTreff: antall,
    kandidater: resultater,
    aggregeringer: [
        { navn: 'listefyll', felt: [] },
        { navn: 'kompetanse', felt: [] },
    ],
};

export default søk;
