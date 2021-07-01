import { ForespørselOutboundDto } from '../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { postJson } from './fetchUtils';
import { baseUrl } from './api';

export const FORESPORSEL_OM_DELING_AV_CV_API = `${baseUrl}/foresporsel-om-deling-av-cv-api`;

export const sendForespørselOmDelingAvCv = (outboundDto: ForespørselOutboundDto) => {
    return postJson(`${FORESPORSEL_OM_DELING_AV_CV_API}/foresporsler`, JSON.stringify(outboundDto));
};
