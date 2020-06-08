import validator from '@navikt/fnrvalidator';
import { hentKandidatnr } from '../../api';

export enum Fritekstinput {
    Validerer,
    IkkeEtFnr,
    ForFåSifre,
    ForMangeSifre,
    UgyldigFnr,
    FantIkkeKandidat,
    FantKandidat,
}

export type Fritekststate = {
    input: Fritekstinput;
    kandidatnr?: string;
};

export const utenKandidatnr = (input: Fritekstinput): Fritekststate => ({
    input,
});

const erKunSifre = (s: string) => s.match(/^[0-9]+$/) !== null;
const erGyldigFnr = (fnr: string) => validator.fnr(fnr).status === 'valid';

export const validerFritekstfelt = async (fnr: string): Promise<Fritekststate> => {
    if (!erKunSifre(fnr) || fnr.length < 9) {
        return { input: Fritekstinput.IkkeEtFnr };
    }

    if (fnr.length < 11) {
        return { input: Fritekstinput.ForFåSifre };
    }

    if (fnr.length > 11) {
        return { input: Fritekstinput.ForMangeSifre };
    }

    if (!erGyldigFnr(fnr)) {
        return { input: Fritekstinput.UgyldigFnr };
    }

    try {
        const kandidatnr = (await hentKandidatnr(fnr)).kandidatnr;
        return {
            input: Fritekstinput.FantKandidat,
            kandidatnr,
        };
    } catch (e) {
        return utenKandidatnr(Fritekstinput.FantIkkeKandidat);
    }
};

export const lagFeilmeldingFraFritekstinput = (input: Fritekstinput): string | undefined => {
    switch (input) {
        case Fritekstinput.ForFåSifre:
            return 'Fødselsnummeret har for få sifre';
        case Fritekstinput.ForMangeSifre:
            return 'Fødselsnummeret har for mange sifre';
        case Fritekstinput.FantIkkeKandidat:
            return 'Kandidaten er ikke synlig i kandidatsøket';
        case Fritekstinput.UgyldigFnr:
            return 'Fødselsnummeret er ikke gyldig';
        default:
            return undefined;
    }
};
