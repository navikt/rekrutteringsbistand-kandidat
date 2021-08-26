import { AktørId } from '../domene/Kandidat';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import {
    StatusPåForespørsel,
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

export const useStatusPåForespørsler = (
    forespørslerOmDelingAvCv: Kandidatforespørsler = {}
): Record<AktørId, StatusPåForespørsel> => {
    const statuser = Object.keys(forespørslerOmDelingAvCv).reduce((statuser, aktørId) => {
        return {
            ...statuser,
            [aktørId]: forespørselTilStatus(forespørslerOmDelingAvCv[aktørId]),
        };
    }, {});

    return statuser;
};

const forespørselTilStatus = (forespørsel: ForespørselOmDelingAvCv) => {
    const { brukerVarslet, aktivitetOpprettet, svar } = forespørsel;

    if (brukerVarslet === null || aktivitetOpprettet === null) {
        return StatusPåForespørsel.IngenRespons;
    }

    if (brukerVarslet === true && aktivitetOpprettet === true) {
        return StatusPåForespørsel.AltGikkBra;
    } else if (brukerVarslet === false && aktivitetOpprettet === false) {
        return StatusPåForespørsel.KortetBleIkkeOpprettet;
    } else if (brukerVarslet === false && aktivitetOpprettet === true) {
        if (svar === SvarPåDelingAvCv.IkkeSvart) {
            return StatusPåForespørsel.VeilederKanSvare;
        } else {
            return StatusPåForespørsel.KanIkkeSvarePåKortet;
        }
    }

    return StatusPåForespørsel.UgyldigStatus;
};

export default useStatusPåForespørsler;
