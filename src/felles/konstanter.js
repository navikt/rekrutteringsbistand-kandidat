
// "pam-kandidatsok" legges på som prefix før alle toggles på serveren,
// så togglen "toggle-test" korresponderer med "pam-kandidatsok.toggle-test" i unleash
const FEATURE_TOGGLES = [
    'vis-manglende-arbeidserfaring-boks',
    'skjul-yrke',
    'skjul-kompetanse',
    'skjul-utdanning',
    'skjul-arbeidserfaring',
    'skjul-spraak',
    'skjul-sted',
    'vis-matchforklaring',
    'ingen-utdanning-filter',
    'bruk-ny-kilde-forerkort'
];
export default FEATURE_TOGGLES;

export const KANDIDATLISTE_CHUNK_SIZE = 25;
export const KANDIDATLISTE_INITIAL_CHUNK_SIZE = 50;


export const UTDANNING = {
    VIDEREGAAENDE: { key: 'Videregaende', label: 'Videregående' },
    FAGSKOLE: { key: 'Fagskole', label: 'Fagskole' },
    BACHELOR: { key: 'Bachelor', label: 'Universitet/høgskole, inntil 4 år' },
    MASTER: { key: 'Master', label: 'Universitet/høgskole, over 4 år' },
    DOKTORGRAD: { key: 'Doktorgrad', label: 'Doktorgrad (PhD)' }
};

export const ALERTTYPE = {
    STILLING: 'stilling',
    UTDANNING: 'utdanning',
    ARBEIDSERFARING: 'arbeidserfaring',
    SPRAK: 'sprak',
    KOMPETANSE: 'kompetanse',
    GEOGRAFI: 'geografi',
    FORERKORT: 'forerkort',
    INNSATSGRUPPE: 'innsatsgruppe'
};


export const KONSEPTTYPE = {
    UTDANNING: 'education level',
    YRKE: 'occupation',
    KOMPETANSE: 'skill',
    SOFT_SKILL: 'soft skill',
    ERFARING: 'experience level',
    STED: 'location',
    FORERKORT: 'license'
};


export const BRANCHNAVN = {
    KOMPETANSE: 'kompetanse',
    STILLING: 'stilling',
    ARBEIDSERFARING: 'arbeidserfaring',
    UTDANNING: 'utdanning',
    GEOGRAFI: 'geografi',
    SPRAK: 'sprak',
    FORERKORT: 'forerkort'
};

export const LAGRE_STATUS = {
    UNSAVED: 'UNSAVED',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
};

export const SLETTE_STATUS = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FINISHED: 'FINISHED',
    FAILURE: 'FAILURE'
};

export const INNSATSGRUPPER = {
    STANDARDINNSATS: { key: 'IKVAL', label: 'Standardinnsats' },
    SITUASJONSBESTEMT_INNSATS: { key: 'BFORM', label: 'Situasjonsbestemt innsats' },
    SPESIELT_TILPASSET_INNSATS: { key: 'BATT', label: 'Spesielt tilpasset innsats' },
    VARIG_TILPASSET: { key: 'VARIG', label: 'Varig tilpasset' },
    SYKEMELDT_UTEN_ARBEIDSGIVER: { key: 'VURDU', label: 'Sykmeldt uten arbeidsgiver' },
    SYKEMELDT_OPPFOLGING_ARBEIDSPLASSEN: { key: 'VURDI', label: 'Sykmeldt med oppfølging på arbeidsplassen' },
    HELSERELATERT_OPPFOLGING_NAV: { key: 'OPPFI', label: 'Helserelatert arbeidsrettet oppfølging i NAV' },
    ARBEIDSEVNEVURDERING: { key: 'BKART', label: 'Behov for arbeidsevnevurdering' }
};

export const OPPSTARTSKODER = {
    LEDIG_NAA: { key: 'LEDIG_NAA', label: 'Kandidaten er ledig nå' },
    ETTER_TRE_MND: { key: 'ETTER_TRE_MND', label: 'Kandidaten har 3 måneder oppsigelse' },
    ETTER_AVTALE: { key: 'ETTER_AVTALE', label: 'Kandidaten er ledig etter avtale' }
};
