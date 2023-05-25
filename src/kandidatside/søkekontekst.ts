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

export const skrivKandidatnrTilKandidatsøkØkt = (kandidatNr: string) => {
    const session = hentØktFraKandidatsøk();

    const oppdatertSession: KandidatsøkØkt = {
        ...session,
        sistBesøkteKandidat: kandidatNr,
    };

    window.sessionStorage.setItem('kandidatsøk', JSON.stringify(oppdatertSession));
};

export const useKandidatsøkøkt = create<KandidatsøkøktState>((set) => ({
    økt: hentØktFraKandidatsøk(),
    setØkt: (økt: KandidatsøkØkt) => set({ økt }),
}));
