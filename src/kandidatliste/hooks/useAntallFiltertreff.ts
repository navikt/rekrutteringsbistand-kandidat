import { useState, useEffect } from 'react';
import { Kandidatstatus, Kandidat, Kandidatlistefilter } from '../kandidatlistetyper';
import { Utfall } from '../kandidatrad/status-og-hendelser/etiketter/UtfallEtikett';

export type AntallFiltertreff = {
    arkiverte: number;
    status: Record<Kandidatstatus, number>;
    utfall: Record<Utfall, number>;
};

const useAntallFiltertreff = (
    kandidater: Kandidat[],
    filter: Kandidatlistefilter
): AntallFiltertreff => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Kandidatstatus, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [antallMedUtfall, setAntallMedUtfall] = useState<Record<Utfall, number>>(
        hentAntallMedUtfall(kandidater)
    );

    useEffect(() => {
        const ikkeSlettedeKandidater = kandidater.filter((kandidat) =>
            filter.visArkiverte ? kandidat.arkivert : !kandidat.arkivert
        );

        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(ikkeSlettedeKandidater));
        setAntallMedUtfall(hentAntallMedUtfall(ikkeSlettedeKandidater));
    }, [kandidater, filter.visArkiverte]);

    const antallTreff = {
        arkiverte: antallArkiverte,
        status: antallMedStatus,
        utfall: antallMedUtfall,
    };

    return antallTreff;
};

const hentAntallArkiverte = (kandidater: Kandidat[]) => {
    return kandidater.filter((kandidat) => kandidat.arkivert).length;
};

const hentAntallMedStatus = (kandidater: Kandidat[]) => {
    const antallMedStatus: Record<string, number> = {};
    Object.values(Kandidatstatus).forEach((status) => {
        antallMedStatus[status] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedStatus[kandidat.status]++;
    });

    return antallMedStatus;
};

const hentAntallMedUtfall = (kandidater: Kandidat[]) => {
    const antallMedUtfall: Record<string, number> = {};
    Object.values(Utfall).forEach((utfall) => {
        antallMedUtfall[utfall] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedUtfall[kandidat.utfall]++;
    });

    return antallMedUtfall;
};

export default useAntallFiltertreff;
