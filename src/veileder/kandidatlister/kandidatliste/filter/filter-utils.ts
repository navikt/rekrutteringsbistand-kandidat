import { Utfall } from './../kandidatrad/KandidatRad';
import { Status } from './../kandidatrad/statusSelect/StatusSelect';

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
