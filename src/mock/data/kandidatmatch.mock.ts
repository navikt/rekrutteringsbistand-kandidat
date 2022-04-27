import { ForeslåttKandidat } from '../../kandidatmatch/VisForeslåttKandidat';
import cver from './cv.mock';

const foreslåtteKandidater: ForeslåttKandidat[] = cver.slice(0, 5).map((cv) => ({
    fornavn: cv.fornavn,
    etternavn: cv.etternavn,
    arenaKandidatnr: cv.kandidatnummer,
    fodselsnummer: cv.fodselsnummer,
    score_arbeidserfaring: 0.24,
    score_jobbprofil: 0.78,
    score_utdannelse: 0.62,
}));

export default foreslåtteKandidater;
