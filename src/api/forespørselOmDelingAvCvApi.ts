import {
    ForespørselOmDelingAvCv,
    ForespørselOutboundDto,
} from '../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { fetchJson, postJson } from './fetchUtils';
import { baseUrl } from './api';

export const FORESPORSEL_OM_DELING_AV_CV_API = `${baseUrl}/foresporsel-om-deling-av-cv-api`;

export const sendForespørselOmDelingAvCv = (
    outboundDto: ForespørselOutboundDto
): Promise<ForespørselOmDelingAvCv[]> => {
    return postJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler`, JSON.stringify(outboundDto));
};

export const fetchForespørslerOmDelingAvCv = (
    stillingsId: string
): Promise<ForespørselOmDelingAvCv[]> => {
    return fetchJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler/${stillingsId}`, true);
};
