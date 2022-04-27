import { ForeslåttKandidat } from '../../kandidatmatch/Kandidatmatch';
import cver from './cv.mock';

const foreslåtteKandidater: ForeslåttKandidat[] = cver.slice(0, 2).map((cv) => ({
    fornavn: cv.fornavn,
    etternavn: cv.etternavn,
    arenaKandidatnr: cv.kandidatnummer,
    fodselsnummer: cv.fodselsnummer,
}));

export default foreslåtteKandidater;
