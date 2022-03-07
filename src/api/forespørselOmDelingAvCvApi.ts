import {
    ForespørselOmDelingAvCv,
    ForespørselOutboundDto,
    ResendForespørselOutboundDto,
} from '../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { fetchJson, postJson } from './fetchUtils';
import { AktørId } from '../kandidatliste/domene/Kandidat';

export const FORESPORSEL_OM_DELING_AV_CV_API = `/foresporsel-om-deling-av-cv-api`;

export type ForespørslerForStillingInboundDto = Partial<Record<AktørId, ForespørselOmDelingAvCv[]>>;

export const sendForespørselOmDelingAvCv = (
    outboundDto: ForespørselOutboundDto
): Promise<ForespørslerForStillingInboundDto> => {
    return postJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler`, JSON.stringify(outboundDto));
};

export const resendForespørselOmDelingAvCv = (
    aktørId: string,
    outboundDto: ResendForespørselOutboundDto
): Promise<ForespørslerForStillingInboundDto> => {
    return postJson(
        `${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler/kandidat/${aktørId}`,
        JSON.stringify(outboundDto)
    );
};

export const fetchForespørslerOmDelingAvCv = (
    stillingsId: string
): Promise<ForespørslerForStillingInboundDto> => {
    return fetchJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler/${stillingsId}`, true);
};

export const fetchForespørslerOmDelingAvCvForKandidat = (
    aktørId: string
): Promise<ForespørselOmDelingAvCv[]> => {
    return fetchJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler/kandidat/${aktørId}`, true);
};
