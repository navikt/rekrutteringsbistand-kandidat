import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/KandidatRad';
import {
    hentAntallArkiverte,
    hentAntallMedStatus,
    hentAntallMedUtfall,
    hentFiltrerteKandidater,
} from './filter-utils';

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
