import { Kandidat, Kandidatstatus } from './../kandidatlistetyper';
import { Utfall } from '../kandidatrad/utfall-select/UtfallMedEndreIkon';
import { Kandidatlistefilter } from '../kandidatlistetyper';

const QUERY_PARAM_SEPARATOR = '-';

export const matchNavn = (navnefilter: string) => (kandidat: Kandidat) => {
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

export const filtrerKandidater = (kandidater: Kandidat[], filter?: Kandidatlistefilter) => {
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

export const lagTomtStatusfilter = (): Record<Kandidatstatus, boolean> => {
    const statusfilter: Record<string, boolean> = {};
    Object.values(Kandidatstatus).forEach((status) => {
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

export const queryParamsTilFilter = (queryParams: URLSearchParams): Kandidatlistefilter => {
    const status = lagTomtStatusfilter();
    const utfall = lagTomtUtfallsfilter();

    const statusParams = queryParams.get('status');
    if (statusParams) {
        statusParams.split(QUERY_PARAM_SEPARATOR).forEach((param) => {
            status[param] = true;
        });
    }

    const utfallsParams = queryParams.get('utfall');
    if (utfallsParams) {
        utfallsParams.split(QUERY_PARAM_SEPARATOR).forEach((param) => {
            utfall[param] = true;
        });
    }

    return {
        status,
        utfall,
        navn: '',
        visArkiverte: queryParams.get('visArkiverte') === 'true',
    };
};

const getTrueKeys = (obj: Record<string, boolean>) =>
    Object.entries(obj)
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

export const filterTilQueryParams = (filter?: Kandidatlistefilter): URLSearchParams => {
    let queryParams = new URLSearchParams();
    if (!filter) {
        return queryParams;
    }

    const statusfiltre = getTrueKeys(filter.status);
    if (statusfiltre.length > 0) {
        queryParams.set('status', statusfiltre.join(QUERY_PARAM_SEPARATOR));
    }

    const utfallsfiltre = getTrueKeys(filter.utfall);
    if (utfallsfiltre.length > 0) {
        queryParams.set('utfall', utfallsfiltre.join(QUERY_PARAM_SEPARATOR));
    }

    if (filter.visArkiverte) {
        queryParams.set('visArkiverte', 'true');
    }

    return queryParams;
};
