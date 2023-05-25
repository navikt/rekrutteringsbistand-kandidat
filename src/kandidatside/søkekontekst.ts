import { create } from 'zustand';

export type KandidatsøkøktState = {
    økt: KandidatsøkØkt;
    setØkt: (økt: KandidatsøkØkt) => void;
};

export type KandidatsøkØkt = Partial<{
    searchParams: string;
    sistBesøkteKandidat: string;
    markerteKandidater: string[];
    navigerbareKandidater: string[];
    totaltAntallKandidater: number;
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

export const useKandidatsøkøkt = create<KandidatsøkøktState>((set) => ({
    økt: hentØktFraKandidatsøk(),
    setØkt: (økt: KandidatsøkØkt) =>
        set((state) => {
            const oppdatertØkt = { ...state.økt, ...økt };
            skrivØktTilSessionStorage(oppdatertØkt);

            return { økt: oppdatertØkt };
        }),
}));
