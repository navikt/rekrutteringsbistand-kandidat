import useFaner from './useFaner';
import { lenkeTilKandidatside } from '../../app/paths';
import { KandidatsøkØkt, useKandidatsøkøkt } from '../søkekontekst';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';
import { useContext, useEffect } from 'react';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kandidatlisteId?: string
): Kandidatnavigering | null => {
    const { økt, setØkt } = useKandidatsøkøkt();
    const [fane] = useFaner();

    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;
    let antall = økt?.totaltAntallKandidater ?? 1;

    if (økt?.navigerbareKandidater !== undefined) {
        index = økt.navigerbareKandidater.findIndex((kandidat) => kandidat === kandidatnr) ?? -1;

        const forrigeKandidatnr = økt.navigerbareKandidater[index - 1];
        const nesteKandidatnr = økt.navigerbareKandidater[index + 1];

        if (forrigeKandidatnr) {
            forrige = lenkeTilKandidatside(forrigeKandidatnr, fane, kandidatlisteId, false, true);
        }

        if (nesteKandidatnr) {
            neste = lenkeTilKandidatside(nesteKandidatnr, fane, kandidatlisteId, false, true);
        }
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(økt.searchParams);
        const sidetall = Math.ceil(index / 25);
        searchParams.set('side', sidetall.toString());

        setØkt({
            searchParams: searchParams.toString(),
            sistBesøkteKandidat: kandidatnr,
        });
    }, [kandidatnr]);

    if (økt?.navigerbareKandidater === undefined) {
        return null;
    }

    return {
        index,
        forrige,
        neste,
        antall,
    };
};

export default useNavigerbareKandidaterFraSøk;
