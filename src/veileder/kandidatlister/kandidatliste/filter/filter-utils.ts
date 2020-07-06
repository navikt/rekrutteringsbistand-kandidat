import { Utfall } from './../kandidatrad/utfall-select/UtfallSelect';
import { Status } from './../kandidatrad/statusSelect/StatusSelect';
import { Kandidatlistefilter } from './useKandidatlistefilter';

const QUERY_PARAM_SEPARATOR = '-';

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

export const queryParamsTilFilter = (queryParams: URLSearchParams) => {
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
        visArkiverte: queryParams.get('visArkiverte') === 'true',
    };
};

const getTrueKeys = (obj: Record<string, boolean>) =>
    Object.entries(obj)
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

export const filterTilQueryParams = (filter: Kandidatlistefilter): URLSearchParams => {
    let queryParams = new URLSearchParams();

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
