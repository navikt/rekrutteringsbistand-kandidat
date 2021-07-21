import { lenkeTilKandidatside, Kandidatfane } from '../../app/paths';
import { erInaktiv } from '../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import useFiltrerteKandidater from '../../kandidatliste/hooks/useFiltrerteKandidater';
import useSorterteKandidater from '../../kandidatliste/hooks/useSorterteKandidater';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';

const useNavigerbareKandidater = (kandidatnr: string, kandidatliste: Kandidatliste) => {
    const aktivFane = useAktivKandidatsidefane();
    const filtrerteKandidater = useFiltrerteKandidater(kandidatliste.kandidater);
    const aktiveKandidater = filtrerteKandidater.filter((kandidat) => !erInaktiv(kandidat));
    const sorterteKandidater = useSorterteKandidater(aktiveKandidater).sorterteKandidater;
    const kandidatnumre = sorterteKandidater.map((kandidat) => kandidat.kandidatnr);

    const hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer
            ? lenkeTilKandidatside(
                  kandidatnummer,
                  aktivFane,
                  kandidatliste.kandidatlisteId,
                  undefined,
                  true
              )
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

export const hentAktivFane = (path: string): Kandidatfane => {
    if (path.split('/').pop() === 'cv') {
        return Kandidatfane.Cv;
    } else {
        return Kandidatfane.Historikk;
    }
};

export default useNavigerbareKandidater;
