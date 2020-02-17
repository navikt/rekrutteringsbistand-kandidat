enum Kategori {
    Fysisk = 'fysisk',
    Arbeidstid = 'arbeidstid',
    Arbeidshverdagen = 'arbeidshverdagen',
    Grunnleggende = 'grunnleggende',
}

export const getKortKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.Fysisk:
            return 'Fysisk';
        case Kategori.Arbeidstid:
            return 'Arbeidstid';
        case Kategori.Arbeidshverdagen:
            return 'Arbeidshverdagen';
        case Kategori.Grunnleggende:
            return 'Grunnleggende ferdigheter';
    }
};

export const getKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.Fysisk:
            return 'Fysisk tilrettelegging av arbeidsplassen';
        case Kategori.Arbeidstid:
            return 'Tilrettelelagt arbeidstid';
        case Kategori.Arbeidshverdagen:
            return 'Tilrettelegging av arbeidshverdagen';
        case Kategori.Grunnleggende:
            return 'Få krav til grunnleggende ferdigheter som språk, regning eller tallforståelse';
    }
};

export default Kategori;
