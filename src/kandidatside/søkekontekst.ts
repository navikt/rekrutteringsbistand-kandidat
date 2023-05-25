import { create } from 'zustand';

export type KandidatsøkøktState = {
    økt: KandidatsøkØkt;
    resetØkt: () => void;
    oppdaterØkt: (økt: KandidatsøkØkt) => void;
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
    resetØkt: () => set({ økt: hentØktFraKandidatsøk() }),
    oppdaterØkt: (felter: KandidatsøkØkt) =>
        set({
            økt: {
                ...hentØktFraKandidatsøk(),
                ...felter,
            },
        }),
}));
