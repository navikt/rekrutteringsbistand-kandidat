import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/Kandidatrad';

const useKandidatlistefilter = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    utfallsfilter: Record<Utfall, boolean>,
    navnefilter: string
): KandidatIKandidatliste[] => {
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

    return filtrerteKandidater;
};

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
        .filter((kandidat) => kandidat.arkivert === visArkiverte)
        .filter(matchNavn(navnefilter))
        .filter((kandidat) => !statusfilterErValgt || statusfilter[kandidat.status])
        .filter((kandidat) => !utfallsfilterErValgt || utfallsfilter[kandidat.utfall]);
};

export default useKandidatlistefilter;
