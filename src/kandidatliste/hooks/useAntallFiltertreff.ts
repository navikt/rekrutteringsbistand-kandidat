import { useState, useEffect } from 'react';
import { Kandidatstatus, Kandidat, Kandidatutfall } from '../domene/Kandidat';
import { Kandidatlistefilter } from '../reducer/kandidatlisteReducer';
import { Hendelse } from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import { Nettressurs } from '../../api/Nettressurs';

export type AntallFiltertreff = {
    arkiverte: number;
    status: Record<Kandidatstatus, number>;
    hendelse: Record<Hendelse, number>;
};

const useAntallFiltertreff = (
    kandidater: Kandidat[],
    forespørslerOmDelingAvCv: Nettressurs<Kandidatforespørsler>,
    filter: Kandidatlistefilter
): AntallFiltertreff => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Kandidatstatus, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [antallMedUtfall, setAntallMedUtfall] = useState<Record<Hendelse, number>>(
        hentAntallMedHendelse(kandidater, forespørslerOmDelingAvCv)
    );

    useEffect(() => {
        const ikkeSlettedeKandidater = kandidater.filter((kandidat) =>
            filter.visArkiverte ? kandidat.arkivert : !kandidat.arkivert
        );

        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(ikkeSlettedeKandidater));
        setAntallMedUtfall(hentAntallMedHendelse(ikkeSlettedeKandidater, forespørslerOmDelingAvCv));
    }, [kandidater, filter.visArkiverte, forespørslerOmDelingAvCv]);

    const antallTreff = {
        arkiverte: antallArkiverte,
        status: antallMedStatus,
        hendelse: antallMedUtfall,
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

const hentAntallMedHendelse = (
    kandidater: Kandidat[],
    forespørslerOmDelingAvCv: Nettressurs<Kandidatforespørsler>
): Record<Hendelse, number> => {
    // TODO: Implementer denne riktig

    const antallMedHendelse: Record<string, number> = {};
    Object.values(Kandidatutfall).forEach((utfall) => {
        antallMedHendelse[utfall] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedHendelse[kandidat.utfall]++;
    });

    return antallMedHendelse;
};

export default useAntallFiltertreff;
