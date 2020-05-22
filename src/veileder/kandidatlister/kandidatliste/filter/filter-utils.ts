import { Utfall } from './../kandidatrad/KandidatRad';
import { Status } from './../kandidatrad/statusSelect/StatusSelect';
import { KandidatIKandidatliste } from './../../kandidatlistetyper';

export const matchArkivering = (visArkiverte: boolean) => (kandidat: KandidatIKandidatliste) =>
    kandidat.arkivert === visArkiverte;

export const matchValgteStatuser = (statusfilter: Record<Status, boolean>) => (
    kandidat: KandidatIKandidatliste
) => statusfilter[kandidat.status];

export const matchValgteUtfall = (utfallsfilter: Record<Utfall, boolean>) => (
    kandidat: KandidatIKandidatliste
) => utfallsfilter[kandidat.utfall];

export const matchNavn = (navnefilter: string) => (kandidat: KandidatIKandidatliste) => {
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

export const hentFiltrerteKandidater = (
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

export const hentAntallArkiverte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter(matchArkivering(true)).length;
};

export const hentAntallMedStatus = (kandidater: KandidatIKandidatliste[]) => {
    const antallMedStatus: Record<string, number> = {};
    Object.values(Status).forEach((status) => {
        antallMedStatus[status] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedStatus[kandidat.status]++;
    });

    return antallMedStatus;
};

export const hentAntallMedUtfall = (kandidater: KandidatIKandidatliste[]) => {
    const antallMedUtfall: Record<string, number> = {};
    Object.values(Utfall).forEach((utfall) => {
        antallMedUtfall[utfall] = 0;
    });

    kandidater.forEach((kandidat) => {
        antallMedUtfall[kandidat.utfall]++;
    });

    return antallMedUtfall;
};

export const lagTomtStatusfilter = (): Record<Status, boolean> => {
    const statusfilter: Record<string, boolean> = {};
    Object.values(Status).forEach((status) => {
        statusfilter[status] = false;
    });

    return statusfilter;
};

export const lagTomtUtfallsfilter = (): Record<Utfall, boolean> => {
    const utfallsfilter: Record<string, boolean> = {};
    Object.values(Utfall).forEach((utfall) => {
        utfallsfilter[utfall] = false;
    });

    return utfallsfilter;
};
