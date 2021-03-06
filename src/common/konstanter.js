const FEATURE_TOGGLES = ['masker-fnr'];

export default FEATURE_TOGGLES;

export const KANDIDATLISTE_CHUNK_SIZE = 100;
export const KANDIDATLISTE_INITIAL_CHUNK_SIZE = 100;

export const UTDANNING = {
    VIDEREGAAENDE: { key: 'Videregaende', label: 'Videregående' },
    FAGSKOLE: { key: 'Fagskole', label: 'Fagskole' },
    BACHELOR: { key: 'Bachelor', label: 'Universitet/høgskole, inntil 4 år' },
    MASTER: { key: 'Master', label: 'Universitet/høgskole, over 4 år' },
    DOKTORGRAD: { key: 'Doktorgrad', label: 'Doktorgrad (PhD)' },
};

export const INNSATSGRUPPER = {
    STANDARDINNSATS: { key: 'IKVAL', label: 'Standardinnsats' },
    SITUASJONSBESTEMT_INNSATS: { key: 'BFORM', label: 'Situasjonsbestemt innsats' },
    SPESIELT_TILPASSET_INNSATS: { key: 'BATT', label: 'Spesielt tilpasset innsats' },
    VARIG_TILPASSET: { key: 'VARIG', label: 'Varig tilpasset' },
    SYKEMELDT_UTEN_ARBEIDSGIVER: { key: 'VURDU', label: 'Sykmeldt uten arbeidsgiver' },
    SYKEMELDT_OPPFOLGING_ARBEIDSPLASSEN: {
        key: 'VURDI',
        label: 'Sykmeldt med oppfølging på arbeidsplassen',
    },
    HELSERELATERT_OPPFOLGING_NAV: {
        key: 'OPPFI',
        label: 'Helserelatert arbeidsrettet oppfølging i NAV',
    },
    ARBEIDSEVNEVURDERING: { key: 'BKART', label: 'Behov for arbeidsevnevurdering' },
};

export const OPPSTARTSKODER = {
    LEDIG_NAA: { key: 'LEDIG_NAA', label: 'Kandidaten er ledig nå' },
    ETTER_TRE_MND: { key: 'ETTER_TRE_MND', label: 'Kandidaten har 3 måneder oppsigelse' },
    ETTER_AVTALE: { key: 'ETTER_AVTALE', label: 'Kandidaten er ledig etter avtale' },
};
