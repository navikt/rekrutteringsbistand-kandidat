import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/Kandidatrad';
import { filterTilQueryParams } from './filter-utils';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';

export type Kandidatlistefilter = {
    visArkiverte: boolean;
    status: Record<Status, boolean>;
    utfall: Record<Utfall, boolean>;
    navn: string;
};

const useKandidatlistefilter = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    statusfilter: Record<Status, boolean>,
    utfallsfilter: Record<Utfall, boolean>,
    navnefilter: string
): KandidatIKandidatliste[] => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        hentFiltrerteKandidater(kandidater, {
            visArkiverte,
            status: statusfilter,
            utfall: utfallsfilter,
            navn: navnefilter,
        })
    );

    useEffect(() => {
        const queryParams = filterTilQueryParams({
            visArkiverte,
            status: statusfilter,
            utfall: utfallsfilter,
            navn: navnefilter,
        });

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            query: queryParams.toString(),
        });

        history.replace(`${history.location.pathname}?${queryParams.toString()}`);
    }, [history, visArkiverte, statusfilter, utfallsfilter, navnefilter, dispatch]);

    useEffect(() => {
        const filtrerte = hentFiltrerteKandidater(kandidater, {
            visArkiverte,
            status: statusfilter,
            utfall: utfallsfilter,
            navn: navnefilter,
        });

        setFiltrerteKandidater(filtrerte);
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
    filter: Kandidatlistefilter
) => {
    const statusfilterErValgt = new Set(Object.values(filter.status)).size > 1;
    const utfallsfilterErValgt = new Set(Object.values(filter.utfall)).size > 1;

    return kandidater
        .filter((kandidat) => kandidat.arkivert === filter.visArkiverte)
        .filter(matchNavn(filter.navn))
        .filter((kandidat) => !statusfilterErValgt || filter.status[kandidat.status])
        .filter((kandidat) => !utfallsfilterErValgt || filter.utfall[kandidat.utfall]);
};

export default useKandidatlistefilter;
