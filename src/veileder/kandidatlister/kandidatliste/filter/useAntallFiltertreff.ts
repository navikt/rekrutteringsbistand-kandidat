import { Utfall } from './../kandidatrad/utfall-select/UtfallSelect';
import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

export type AntallFiltertreff = {
    arkiverte: number;
    status: Record<Status, number>;
    utfall: Record<Utfall, number>;
};

const useKandidatlistefilter = (kandidater: KandidatIKandidatliste[]): AntallFiltertreff => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Status, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [antallMedUtfall, setAntallMedUtfall] = useState<Record<Utfall, number>>(
        hentAntallMedUtfall(kandidater)
    );

    useEffect(() => {
        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(kandidater));
        setAntallMedUtfall(hentAntallMedUtfall(kandidater));
    }, [kandidater]);

    const antallTreff = {
        arkiverte: antallArkiverte,
        status: antallMedStatus,
        utfall: antallMedUtfall,
    };

    return antallTreff;
};

const hentAntallArkiverte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter((kandidat) => kandidat.arkivert).length;
};

const hentAntallMedStatus = (kandidater: KandidatIKandidatliste[]) => {
    const antallMedStatus: Record<string, number> = {};
    Object.values(Status).forEach((status) => {
        antallMedStatus[status] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedStatus[kandidat.status]++;
    });

    return antallMedStatus;
};

const hentAntallMedUtfall = (kandidater: KandidatIKandidatliste[]) => {
    const antallMedUtfall: Record<string, number> = {};
    Object.values(Utfall).forEach((utfall) => {
        antallMedUtfall[utfall] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedUtfall[kandidat.utfall]++;
    });

    return antallMedUtfall;
};

export default useKandidatlistefilter;
