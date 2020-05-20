import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import { Status } from './kandidatrad/statusSelect/StatusSelect';

const matchArkivering = (visArkiverte: boolean) => (kandidat: KandidatIKandidatliste) =>
    kandidat.arkivert === visArkiverte;

const matchValgteStatuser = (statusfilter: Record<Status, boolean>) => (
    kandidat: KandidatIKandidatliste
) => statusfilter[kandidat.status];

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

const hentFiltrerteKandidater = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    navnefilter: string
) => {
    let filtrerteKandidater = kandidater
        .filter(matchArkivering(visArkiverte))
        .filter(matchNavn(navnefilter));

    const statusfilterErValgt = new Set(Object.values(statusfilter)).size > 1;
    if (statusfilterErValgt) {
        filtrerteKandidater = filtrerteKandidater.filter(matchValgteStatuser(statusfilter));
    }

    return filtrerteKandidater;
};

const erAlleKandidaterMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter((k) => !k.markert).length === 0;
};

type Returverdi = [KandidatIKandidatliste[], number, Record<Status, number>, boolean];

const useKandidatlistefilter = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    navnefilter: string
): Returverdi => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [antallMedStatus, setAntallMedStatus] = useState<Record<Status, number>>(
        hentAntallMedStatus(kandidater)
    );
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleKandidaterMarkerte(kandidater)
    );
    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        hentFiltrerteKandidater(kandidater, visArkiverte, statusfilter, navnefilter)
    );

    useEffect(() => {
        setFiltrerteKandidater(
            hentFiltrerteKandidater(kandidater, visArkiverte, statusfilter, navnefilter)
        );
    }, [kandidater, visArkiverte, statusfilter, navnefilter]);

    useEffect(() => {
        setAntallArkiverte(hentAntallArkiverte(kandidater));
        setAntallMedStatus(hentAntallMedStatus(kandidater));
    }, [kandidater]);

    useEffect(() => {
        setAlleErMarkerte(erAlleKandidaterMarkerte(filtrerteKandidater));
    }, [filtrerteKandidater]);

    return [filtrerteKandidater, antallArkiverte, antallMedStatus, alleErMarkerte];
};

export default useKandidatlistefilter;
