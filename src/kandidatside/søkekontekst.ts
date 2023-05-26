export type KandidatsøkØkt = Partial<{
    searchParams: string;
    sistBesøkteKandidat: string;
    markerteKandidater: string[];
    navigerbareKandidater: string[];
    totaltAntallKandidater: number;
    pageSize: number;
}>;

export const hentØktFraKandidatsøk = (): KandidatsøkØkt => {
    const kandidatsøkString = window.sessionStorage.getItem('kandidatsøk');

    if (!kandidatsøkString) {
        return {};
    }

    return JSON.parse(kandidatsøkString);
};

export const skrivØktTilSessionStorage = (økt: KandidatsøkØkt) => {
    window.sessionStorage.setItem('kandidatsøk', JSON.stringify(økt));
};

export const useKandidatsøkøkt = () => {
    return {
        økt: hentØktFraKandidatsøk(),
        oppdaterØkt: (felter: KandidatsøkØkt) => {
            skrivØktTilSessionStorage({
                ...hentØktFraKandidatsøk(),
                ...felter,
            });
        },
    };
};
