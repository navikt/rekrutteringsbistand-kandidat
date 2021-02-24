import validator from '@navikt/fnrvalidator';
import { hentKandidatnr } from '../../../api/api';

export enum Fritekststatus {
    Validerer,
    IkkeEtFnr,
    ForFåSifre,
    ForMangeSifre,
    UgyldigFnr,
    FantIkkeKandidat,
    FantKandidat,
}

export type Fritekstvalidering = {
    status: Fritekststatus;
    kandidatnr?: string;
    feilmelding?: string;
};

const erKunSifre = (s: string) => s.match(/^[0-9]+$/) !== null;
const erGyldigFnr = (fnr: string) => validator.fnr(fnr).status === 'valid';

export const validerFritekstfelt = async (fnr: string): Promise<Fritekstvalidering> => {
    if (!erKunSifre(fnr) || fnr.length < 9) {
        return { status: Fritekststatus.IkkeEtFnr };
    }

    if (fnr.length < 11) {
        return {
            status: Fritekststatus.ForFåSifre,
            feilmelding: 'Fødselsnummeret har for få sifre',
        };
    }

    if (fnr.length > 11) {
        return {
            status: Fritekststatus.ForMangeSifre,
            feilmelding: 'Fødselsnummeret har for mange sifre',
        };
    }

    if (!erGyldigFnr(fnr)) {
        return { status: Fritekststatus.UgyldigFnr, feilmelding: 'Fødselsnummeret er ikke gyldig' };
    }

    try {
        const kandidatnr = (await hentKandidatnr(fnr)).kandidatnr;
        return {
            status: Fritekststatus.FantKandidat,
            kandidatnr,
        };
    } catch (e) {
        return {
            status: Fritekststatus.FantIkkeKandidat,
            feilmelding: 'Kandidaten er ikke synlig i kandidatsøket',
        };
    }
};
