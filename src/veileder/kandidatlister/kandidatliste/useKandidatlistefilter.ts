import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../kandidatlistetyper';

const matchArkivering = (visArkiverte: boolean) => (kandidat: KandidatIKandidatliste) =>
    kandidat.arkivert === visArkiverte;

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

const hentFiltrerteKandidater = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    navnefilter: string
) => {
    return kandidater.filter(matchArkivering(visArkiverte)).filter(matchNavn(navnefilter));
};

const erAlleKandidaterMarkerte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter((k) => !k.markert).length === 0;
};

type Returverdi = [KandidatIKandidatliste[], number, boolean];

const useKandidatlistefilter = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    navnefilter: string
): Returverdi => {
    const [antallArkiverte, setAntallArkiverte] = useState<number>(hentAntallArkiverte(kandidater));
    const [alleErMarkerte, setAlleErMarkerte] = useState<boolean>(
        erAlleKandidaterMarkerte(kandidater)
    );
    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        hentFiltrerteKandidater(kandidater, visArkiverte, navnefilter)
    );

    useEffect(() => {
        setFiltrerteKandidater(hentFiltrerteKandidater(kandidater, visArkiverte, navnefilter));
    }, [kandidater, visArkiverte, navnefilter]);

    useEffect(() => {
        setAntallArkiverte(hentAntallArkiverte(kandidater));
    }, [kandidater]);

    useEffect(() => {
        setAlleErMarkerte(erAlleKandidaterMarkerte(filtrerteKandidater));
    }, [filtrerteKandidater]);

    return [filtrerteKandidater, antallArkiverte, alleErMarkerte];
};

export default useKandidatlistefilter;
