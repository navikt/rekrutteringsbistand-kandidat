import { Kandidat } from './../kandidatlistetyper';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { filterTilQueryParams } from './filter-utils';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from './../kandidatrad/utfall-select/UtfallSelect';

export type Kandidatlistefilter = {
    visArkiverte: boolean;
    status: Record<Status, boolean>;
    utfall: Record<Utfall, boolean>;
    navn: string;
};

const useKandidatlistefilter = (filter: Kandidatlistefilter) => {
    const history = useHistory();

    useEffect(() => {
        const query = filterTilQueryParams(filter).toString();
        history.replace(`${history.location.pathname}?${query}`);
    }, [history, filter]);
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

export const hentFiltrerteKandidater = (kandidater: Kandidat[], filter?: Kandidatlistefilter) => {
    if (!filter) {
        return kandidater.map((kandidat) => kandidat.kandidatnr);
    }

    const statusfilterErValgt = new Set(Object.values(filter.status)).size > 1;
    const utfallsfilterErValgt = new Set(Object.values(filter.utfall)).size > 1;

    return kandidater
        .filter((kandidat) => kandidat.arkivert === filter.visArkiverte)
        .filter(matchNavn(filter.navn))
        .filter((kandidat) => !statusfilterErValgt || filter.status[kandidat.status])
        .filter((kandidat) => !utfallsfilterErValgt || filter.utfall[kandidat.utfall])
        .map((kandidat) => kandidat.kandidatnr);
};

export default useKandidatlistefilter;
