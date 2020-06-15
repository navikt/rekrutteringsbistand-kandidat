import { Utfall } from '../kandidatrad/Kandidatrad';
import { Status } from './../kandidatrad/statusSelect/StatusSelect';
import { Kandidatlistefilter } from './useKandidatlistefilter';
import * as H from 'history';

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

const getTrueKeys = (obj: Record<string, boolean>) =>
    Object.entries(obj)
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

export const settFilterIUrl = (history: H.History<any>, filter: Kandidatlistefilter) => {
    let queryParams = new URLSearchParams();

    const statusfiltre = getTrueKeys(filter.status);
    if (statusfiltre.length > 0) {
        queryParams.set('status', statusfiltre.join('_'));
    }

    const utfallsfiltre = getTrueKeys(filter.utfall);
    if (utfallsfiltre.length > 0) {
        queryParams.set('utfall', utfallsfiltre.join('_'));
    }

    if (filter.visArkiverte) {
        queryParams.set('visArkiverte', 'true');
    }

    history.replace(`${history.location.pathname}?${queryParams.toString()}`);
};
