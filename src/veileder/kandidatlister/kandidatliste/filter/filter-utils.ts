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
