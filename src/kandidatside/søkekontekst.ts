export type KandidatsøkØkt = Partial<{
    searchParams: string;
    query: object;
    sistBesøkteKandidat: string;
    markerteKandidater: string[];
    kandidaterPåSiden: string[];
    sidestørrelse: number;
    totaltAntallKandidater: number;
}>;

export const hentØktFraKandidatsøk = (): KandidatsøkØkt | null => {
    const kandidatsøkString = window.sessionStorage.getItem('kandidatsøk');

    if (!kandidatsøkString) {
        return null;
    }

    return JSON.parse(kandidatsøkString);
};

export const skrivKandidatnrTilKandidatsøkØkt = (kandidatNr: string) => {
    const session = hentØktFraKandidatsøk() || {};

    const oppdatertSession: KandidatsøkØkt = {
        ...session,
        sistBesøkteKandidat: kandidatNr,
    };

    window.sessionStorage.setItem('kandidatsøk', JSON.stringify(oppdatertSession));
};
