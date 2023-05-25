import { useEffect } from 'react';
import { Kandidatfane, lenkeTilKandidatside } from '../../app/paths';
import { useKandidatsøkøkt } from '../søkekontekst';
import { Kandidatnavigering } from '../komponenter/header/forrige-neste/ForrigeNeste';
import useFaner from './useFaner';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kandidatlisteId?: string
): Kandidatnavigering | null => {
    const { økt, oppdaterØkt } = useKandidatsøkøkt();
    const [fane] = useFaner();

    const totaltAntallKandidater = økt?.totaltAntallKandidater ?? 1;
    const [index, forrige, neste] = byggLenkeTilForrigeOgNesteKandidat(
        kandidatnr,
        økt.navigerbareKandidater,
        fane,
        kandidatlisteId
    );

    useEffect(() => {
        const searchParams = new URLSearchParams(økt.searchParams);
        const sidetall = Math.ceil((index + 1) / 25);
        searchParams.set('side', sidetall.toString());

        oppdaterØkt({
            searchParams: searchParams.toString(),
            sistBesøkteKandidat: kandidatnr,
        });
    }, [kandidatnr]);

    if (!økt.navigerbareKandidater) {
        return null;
    }

    return {
        index,
        forrige,
        neste,
        antall: totaltAntallKandidater,
    };
};

const byggLenkeTilForrigeOgNesteKandidat = (
    currentKandidat: string,
    navigerbareKandidater: string[] | undefined,
    fane: Kandidatfane,
    kandidatlisteId?: string
): [number, string | undefined, string | undefined] => {
    if (!navigerbareKandidater) {
        return [0, undefined, undefined];
    }

    const index = navigerbareKandidater.indexOf(currentKandidat);
    if (index === -1) {
        return [0, undefined, undefined];
    }

    const forrige = navigerbareKandidater[index - 1]
        ? lenkeTilKandidatside(navigerbareKandidater[index - 1], fane, kandidatlisteId, false, true)
        : undefined;

    const neste = navigerbareKandidater[index + 1]
        ? lenkeTilKandidatside(navigerbareKandidater[index + 1], fane, kandidatlisteId, false, true)
        : undefined;

    return [index, forrige, neste];
};

export default useNavigerbareKandidaterFraSøk;
