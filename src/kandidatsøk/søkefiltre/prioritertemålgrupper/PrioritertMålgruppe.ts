enum PrioritertMålgruppe {
    HullICv = 'hullICv',
}

export const getKategoriLabel = (kategori: PrioritertMålgruppe) => {
    switch (kategori) {
        case PrioritertMålgruppe.HullICv:
            return 'Hull i CV';
    }
};

export default PrioritertMålgruppe;
