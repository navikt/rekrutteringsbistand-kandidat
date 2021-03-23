enum Kategori {
    HullICv = 'hullICv',
}

export const getKategoriLabel = (kategori: Kategori) => {
    switch (kategori) {
        case Kategori.HullICv:
            return 'Hull i CV';
    }
};

export default Kategori;
