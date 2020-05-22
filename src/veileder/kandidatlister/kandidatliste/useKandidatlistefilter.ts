import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import { Utfall } from './kandidatrad/KandidatRad';

const matchArkivering = (visArkiverte: boolean) => (kandidat: KandidatIKandidatliste) =>
    kandidat.arkivert === visArkiverte;

const matchValgteStatuser = (statusfilter: Record<Status, boolean>) => (
    kandidat: KandidatIKandidatliste
) => statusfilter[kandidat.status];

const matchValgteUtfall = (utfallsfilter: Record<Utfall, boolean>) => (
    kandidat: KandidatIKandidatliste
) => utfallsfilter[kandidat.utfall];

const matchNavn = (navnefilter: string) => (kandidat: KandidatIKandidatliste) => {
    const trimmet = navnefilter.trim();
    if (trimmet.length === 0) return true;

    const [normalisertFilter, normalisertFornavn, normalisertEtternavn] = [
        trimmet,
        kandidat.fornavn,
        kandidat.etternavn,
    ].map((s) => s.toLowerCase());

    const navn = normalisertFornavn + ' ' + normalisertEtternavn;
    return navn.includes(normalisertFilter);
};

const hentAntallArkiverte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter(matchArkivering(true)).length;
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

type Returverdi = [
    KandidatIKandidatliste[],
    number,
    Record<Status, number>,
    Record<Utfall, number>,
    boolean
];

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

    return [filtrerteKandidater, antallArkiverte, antallMedStatus, antallMedUtfall, alleErMarkerte];
};

export default useKandidatlistefilter;
