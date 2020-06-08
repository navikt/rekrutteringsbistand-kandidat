import validator from '@navikt/fnrvalidator';
import { hentKandidatnr } from '../../api';

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
};

export const utenKandidatnr = (status: Fritekststatus): Fritekstvalidering => ({
    status,
});

const erKunSifre = (s: string) => s.match(/^[0-9]+$/) !== null;
const erGyldigFnr = (fnr: string) => validator.fnr(fnr).status === 'valid';

export const validerFritekstfelt = async (fnr: string): Promise<Fritekstvalidering> => {
    if (!erKunSifre(fnr) || fnr.length < 9) {
        return { status: Fritekststatus.IkkeEtFnr };
    }

    if (fnr.length < 11) {
        return { status: Fritekststatus.ForFåSifre };
    }

    if (fnr.length > 11) {
        return { status: Fritekststatus.ForMangeSifre };
    }

    if (!erGyldigFnr(fnr)) {
        return { status: Fritekststatus.UgyldigFnr };
    }

    try {
        const kandidatnr = (await hentKandidatnr(fnr)).kandidatnr;
        return {
            status: Fritekststatus.FantKandidat,
            kandidatnr,
        };
    } catch (e) {
        return utenKandidatnr(Fritekststatus.FantIkkeKandidat);
    }
};

export const lagFeilmeldingFraFritekstinput = (input: Fritekststatus): string | undefined => {
    switch (input) {
        case Fritekststatus.ForFåSifre:
            return 'Fødselsnummeret har for få sifre';
        case Fritekststatus.ForMangeSifre:
            return 'Fødselsnummeret har for mange sifre';
        case Fritekststatus.FantIkkeKandidat:
            return 'Kandidaten er ikke synlig i kandidatsøket';
        case Fritekststatus.UgyldigFnr:
            return 'Fødselsnummeret er ikke gyldig';
        default:
            return undefined;
    }
};
