export type NyttKandidatsøkØkt = Partial<{
    sistBesøkteKandidat: string;
    markerteKandidater: string[];
    kandidater: string[];
    searchParams: string;
}>;

export type FraAutomatiskMatching = {
    kontekst: 'fraAutomatiskMatching';
    stillingsId: string;
};

export type FraKandidatsøk = {
    kontekst: 'fraKandidatsøk';
    søk?: string;
};

export type FinnKandidaterTilKandidatlisteMedStilling = {
    kontekst: 'finnKandidaterTilKandidatlisteMedStilling';
    stillingsId: string;
    søk?: string;
};

export type FinnKandidaterTilKandidatlisteUtenStilling = {
    kontekst: 'finnKandidaterTilKandidatlisteUtenStilling';
    kandidatlisteId: string;
    søk?: string;
};

export type FraNyttkandidatsøk = {
    kontekst: 'fraNyttKandidatsøk';
    økt?: NyttKandidatsøkØkt;
};

export type FinnKandidaterTilKandidatlisteFraNyttKandidatsøkKontekst = {
    kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk';
    kandidatlisteId: string;
    økt?: NyttKandidatsøkØkt;
};

export type Søkekontekst =
    | FraAutomatiskMatching
    | FraKandidatsøk
    | FinnKandidaterTilKandidatlisteMedStilling
    | FinnKandidaterTilKandidatlisteUtenStilling
    | FraNyttkandidatsøk
    | FinnKandidaterTilKandidatlisteFraNyttKandidatsøkKontekst;

export const hentSøkekontekst = (
    kandidatnr: string,
    stillingsIdFraUrl: string | undefined,
    kandidatlisteIdFraUrl: string | undefined,
    fraNyttKandidatsøk: boolean,
    fraAutomatiskMatching: boolean,
    søkeparametreFraGammeltSøk: string,
    nyttKandidatsøkØkt?: NyttKandidatsøkØkt
): Søkekontekst => {
    if (fraAutomatiskMatching && stillingsIdFraUrl) {
        return {
            kontekst: 'fraAutomatiskMatching',
            stillingsId: stillingsIdFraUrl,
        };
    }
    if (fraNyttKandidatsøk) {
        skrivKandidatnrTilNyttKandidatsøkØkt(kandidatnr);

        if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk',
                kandidatlisteId: kandidatlisteIdFraUrl,
                økt: nyttKandidatsøkØkt,
            };
        } else {
            return {
                kontekst: 'fraNyttKandidatsøk',
                økt: nyttKandidatsøkØkt,
            };
        }
    } else {
        if (stillingsIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteMedStilling',
                stillingsId: stillingsIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteUtenStilling',
                kandidatlisteId: kandidatlisteIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else {
            return { kontekst: 'fraKandidatsøk', søk: søkeparametreFraGammeltSøk };
        }
    }
};

export const hentØktFraNyttKandidatsøk = (): NyttKandidatsøkØkt | undefined => {
    const kandidatsøkString = window.sessionStorage.getItem('kandidatsøk');

    if (!kandidatsøkString) {
        return undefined;
    }

    return JSON.parse(kandidatsøkString);
};

export const skrivKandidatnrTilNyttKandidatsøkØkt = (kandidatNr: string) => {
    const session = hentØktFraNyttKandidatsøk() || {};

    const oppdatertSession: NyttKandidatsøkØkt = {
        ...session,
        sistBesøkteKandidat: kandidatNr,
    };

    window.sessionStorage.setItem('kandidatsøk', JSON.stringify(oppdatertSession));
};
