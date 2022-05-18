import { useEffect, useState } from 'react';
import { Kandidat, Kandidatstatus } from '../domene/Kandidat';
import { Kandidatlistefilter } from '../reducer/kandidatlisteReducer';
import {
    Hendelse,
    hentKandidatensSisteHendelse,
} from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import {
    ForespørslerGruppertPåAktørId,
    hentForespørslerForKandidatForStilling,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

export type AntallFiltertreff = {
    arkiverte: number;
    status: Record<Kandidatstatus, number>;
    hendelse: Record<Hendelse, number>;
};

const useAntallFiltertreff = (
    kandidater: Kandidat[],
    forespørslerOmDelingAvCv: Nettressurs<ForespørslerGruppertPåAktørId>,
    filter: Kandidatlistefilter
): AntallFiltertreff => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Kandidatstatus, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [antallMedHendelse, setAntallMedHendelse] = useState<Record<Hendelse, number>>(
        hentAntallMedHendelse(kandidater, forespørslerOmDelingAvCv)
    );

    useEffect(() => {
        const ikkeSlettedeKandidater = kandidater.filter((kandidat) =>
            filter.visArkiverte ? kandidat.arkivert : !kandidat.arkivert
        );

        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(ikkeSlettedeKandidater));
        setAntallMedHendelse(
            hentAntallMedHendelse(ikkeSlettedeKandidater, forespørslerOmDelingAvCv)
        );
    }, [kandidater, filter.visArkiverte, forespørslerOmDelingAvCv]);

    const antallTreff = {
        arkiverte: antallArkiverte,
        status: antallMedStatus,
        hendelse: antallMedHendelse,
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
    forespørslerOmDelingAvCv: Nettressurs<ForespørslerGruppertPåAktørId>
): Record<Hendelse, number> => {
    const antallMedHendelse: Record<string, number> = {};
    Object.values(Hendelse).forEach((hendelse) => {
        antallMedHendelse[hendelse] = 0;
    });

    kandidater.forEach((kandidat) => {
        const hendelse = hentKandidatensSisteHendelse(
            kandidat.utfall,
            kandidat.utfallsendringer,
            forespørslerOmDelingAvCv.kind === Nettstatus.Suksess
                ? hentForespørslerForKandidatForStilling(
                      kandidat.aktørid,
                      forespørslerOmDelingAvCv.data
                  )?.gjeldendeForespørsel
                : undefined
        );

        antallMedHendelse[hendelse]++;
    });

    return antallMedHendelse;
};

export default useAntallFiltertreff;
