
// "pam-kandidatsok" legges på som prefix før alle toggles på serveren,
// så togglen "toggle-test" korresponderer med "pam-kandidatsok.toggle-test" i unleash
const FEATURE_TOGGLES = [
    'vis-manglende-arbeidserfaring-boks',
    'janzz-enabled',
    'skjul-yrke',
    'skjul-kompetanse',
    'skjul-utdanning',
    'skjul-arbeidserfaring',
    'skjul-spraak',
    'skjul-sted',
    'vis-matchforklaring',
    'ingen-utdanning-filter',
    'vis-kandidatlister',
    'vis-geografi-maa-bo-checkbox'
];
export default FEATURE_TOGGLES;


export const ALERTTYPE = {
    STILLING: 'stilling',
    UTDANNING: 'utdanning',
    ARBEIDSERFARING: 'arbeidserfaring',
    SPRAK: 'sprak',
    KOMPETANSE: 'kompetanse',
    GEOGRAFI: 'geografi'
};


export const KONSEPTTYPE = {
    UTDANNING: 'education level',
    YRKE: 'occupation',
    KOMPETANSE: 'skill',
    SOFT_SKILL: 'soft skill',
    ERFARING: 'experience level',
    STED: 'location'
};


export const BRANCHNAVN = {
    KOMPETANSE: 'kompetanse',
    STILLING: 'stilling',
    ARBEIDSERFARING: 'arbeidserfaring',
    UTDANNING: 'utdanning',
    GEOGRAFI: 'geografi',
    SPRAK: 'sprak'
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
