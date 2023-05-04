import { useSelector } from 'react-redux';
import { lenkeTilKandidatside, Kandidatfane } from '../../app/paths';
import AppState from '../../state/AppState';
import { erInaktiv } from '../../kandidatliste/domene/Kandidat';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import useFiltrerteKandidater from '../../kandidatliste/hooks/useFiltrerteKandidater';
import useSorterteKandidater from '../../kandidatliste/hooks/useSorterteKandidater';
import useFaner from '../hooks/useFaner';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';

const useNavigerbareKandidater = (
    kandidatnr: string,
    kandidatliste: Kandidatliste
): Kandidatnavigering => {
    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    const [fane] = useFaner();
    const filtrerteKandidater = useFiltrerteKandidater(kandidatliste.kandidater);
    const aktiveKandidater = filtrerteKandidater.filter((kandidat) => !erInaktiv(kandidat));
    const sorterteKandidater = useSorterteKandidater(
        aktiveKandidater,
        forespørslerOmDelingAvCv
    ).sorterteKandidater;
    const kandidatnumre = sorterteKandidater.map((kandidat) => kandidat.kandidatnr);

    const hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer
            ? lenkeTilKandidatside(kandidatnummer, fane, kandidatliste.kandidatlisteId, true)
            : undefined;

    const index = kandidatnumre.indexOf(kandidatnr);
    const nesteKandidatNummer = kandidatnumre[index + 1];
    const forrigeKandidatNummer = kandidatnumre[index - 1];

    const forrige = hentLenkeTilKandidat(forrigeKandidatNummer);
    const neste = hentLenkeTilKandidat(nesteKandidatNummer);

    return {
        index,
        forrige,
        neste,
        antall: kandidatnumre.length,
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
