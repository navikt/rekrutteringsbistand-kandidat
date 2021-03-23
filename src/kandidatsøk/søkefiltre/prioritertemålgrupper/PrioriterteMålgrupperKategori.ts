enum PrioriterteMålgrupperKategori {
    HullICv = 'hullICv',
}

export const getKategoriLabel = (kategori: PrioriterteMålgrupperKategori) => {
    switch (kategori) {
        case PrioriterteMålgrupperKategori.HullICv:
            return 'Hull i CV';
    }
};

export default PrioriterteMålgrupperKategori;
