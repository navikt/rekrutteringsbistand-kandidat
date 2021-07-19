import { lenkeTilCv } from '../../app/paths';
import { erInaktiv } from '../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import useFiltrerteKandidater from '../../kandidatliste/hooks/useFiltrerteKandidater';
import useSorterteKandidater from '../../kandidatliste/hooks/useSorterteKandidater';

const useNavigerbareKandidater = (kandidatnr: string, kandidatliste: Kandidatliste) => {
    const filtrerteKandidater = useFiltrerteKandidater(kandidatliste.kandidater);
    const aktiveKandidater = filtrerteKandidater.filter((kandidat) => !erInaktiv(kandidat));
    const sorterteKandidater = useSorterteKandidater(aktiveKandidater).sorterteKandidater;
    const kandidatnumre = sorterteKandidater.map((kandidat) => kandidat.kandidatnr);

    const hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer
            ? lenkeTilCv(kandidatnummer, kandidatliste.kandidatlisteId, undefined, true)
            : undefined;

    const aktivKandidat = kandidatnumre.indexOf(kandidatnr);
    const nesteKandidatNummer = kandidatnumre[aktivKandidat + 1];
    const forrigeKandidatNummer = kandidatnumre[aktivKandidat - 1];

    const forrigeKandidatLink = hentLenkeTilKandidat(forrigeKandidatNummer);
    const nesteKandidatLink = hentLenkeTilKandidat(nesteKandidatNummer);

    return {
        aktivKandidat,
        antallKandidater: kandidatnumre.length,
        lenkeTilForrige: forrigeKandidatLink,
        lenkeTilNeste: nesteKandidatLink,
    };
};

export default useNavigerbareKandidater;
