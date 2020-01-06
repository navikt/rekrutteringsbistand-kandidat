enum Kategori {
    Fysisk = 'FYSISK',
    Arbeidstid = 'ARBEIDSTID',
    Arbeidsmiljø = 'ARBEIDSMILJØ',
    Grunnleggende = 'GRUNNLEGGENDE'
}

export const getKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.Fysisk:
            return 'Fysisk tilrettelegging av arbeidsplassen';
        case Kategori.Arbeidstid:
            return 'Tilrettelelagt arbeidstid';
        case Kategori.Arbeidsmiljø:
            return 'Tilrettelegging av arbeidsmiljøet';
        case Kategori.Grunnleggende:
            return 'Få krav til grunnleggende ferdigheter som språk, regning eller tallforståelse';
    }
};

export default Kategori;
