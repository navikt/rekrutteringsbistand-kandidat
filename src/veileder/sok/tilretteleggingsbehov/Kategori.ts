enum Kategori {
    Arbeidstid = 'arbeidstid',
    Fysisk = 'fysisk',
    Arbeidshverdagen = 'arbeidsmiljo',
    UtfordringerMedNorsk = 'grunnleggende',
}

export const getKortKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.Fysisk:
            return 'Fysisk';
        case Kategori.Arbeidstid:
            return 'Arbeidstid';
        case Kategori.Arbeidshverdagen:
            return 'Arbeidshverdagen';
        case Kategori.UtfordringerMedNorsk:
            return 'Utfordringer med norsk';
    }
};

export const getKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.Fysisk:
            return 'Fysisk tilrettelegging på arbeidsplassen';
        case Kategori.Arbeidstid:
            return 'Tilrettelagt arbeidstid';
        case Kategori.Arbeidshverdagen:
            return 'Tilpasninger i arbeidshverdagen';
        case Kategori.UtfordringerMedNorsk:
            return 'Utfordringer med norsk';
    }
};

export default Kategori;
