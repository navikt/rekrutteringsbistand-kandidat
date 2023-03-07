export type NyttKandidatsøkØkt = Partial<{
    sistBesøkteKandidat: string;
    markerteKandidater: string[];
    kandidater: string[];
    searchParams: string;
}>;

export const hentØktFraNyttKandidatsøk = (): NyttKandidatsøkØkt | null => {
    const kandidatsøkString = window.sessionStorage.getItem('kandidatsøk');

    if (!kandidatsøkString) {
        return null;
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
