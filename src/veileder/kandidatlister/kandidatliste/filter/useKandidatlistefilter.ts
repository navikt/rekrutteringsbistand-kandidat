import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/KandidatRad';
import {
    matchArkivering,
    matchNavn,
    matchValgteStatuser,
    matchValgteUtfall,
    hentAntallArkiverte,
    hentAntallMedStatus,
    hentAntallMedUtfall,
} from './filter-utils';

const hentFiltrerteKandidater = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    utfallsfilter: Record<Utfall, boolean>,
    navnefilter: string
) => {
    const statusfilterErValgt = new Set(Object.values(statusfilter)).size > 1;
    const utfallsfilterErValgt = new Set(Object.values(utfallsfilter)).size > 1;

    return kandidater
        .filter(matchArkivering(visArkiverte))
        .filter(matchNavn(navnefilter))
        .filter((kandidat) => !statusfilterErValgt || matchValgteStatuser(statusfilter)(kandidat))
        .filter((kandidat) => !utfallsfilterErValgt || matchValgteUtfall(utfallsfilter)(kandidat));
};

const erAlleKandidaterMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.length > 0 && kandidater.filter((k) => !k.markert).length === 0;
};

export type AntallFiltertreff = {
    arkiverte: number;
    status: Record<Status, number>;
    utfall: Record<Utfall, number>;
};

type Returverdi = [KandidatIKandidatliste[], AntallFiltertreff, boolean];

const useKandidatlistefilter = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    utfallsfilter: Record<Utfall, boolean>,
    navnefilter: string
): Returverdi => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Status, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [antallMedUtfall, setAntallMedUtfall] = useState<Record<Utfall, number>>(
        hentAntallMedUtfall(kandidater)
    );
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleKandidaterMarkerte(kandidater)
    );
    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        hentFiltrerteKandidater(kandidater, visArkiverte, statusfilter, utfallsfilter, navnefilter)
    );

    useEffect(() => {
        setFiltrerteKandidater(
            hentFiltrerteKandidater(
                kandidater,
                visArkiverte,
                statusfilter,
                utfallsfilter,
                navnefilter
            )
        );
    }, [kandidater, visArkiverte, statusfilter, utfallsfilter, navnefilter]);

    useEffect(() => {
        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(kandidater));
        setAntallMedUtfall(hentAntallMedUtfall(kandidater));
    }, [kandidater]);

    useEffect(() => {
        setAlleErMarkerte(erAlleKandidaterMarkerte(filtrerteKandidater));
    }, [filtrerteKandidater]);

    const antallTreff = {
        arkiverte: antallArkiverte,
        status: antallMedStatus,
        utfall: antallMedUtfall,
    };

    return [filtrerteKandidater, antallTreff, alleErMarkerte];
};

export default useKandidatlistefilter;
