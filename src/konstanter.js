
// "pam-kandidatsok" legges på som prefix før alle toggles på serveren,
// så togglen "toggle-test" korresponderer med "pam-kandidatsok.toggle-test" i unleash
const FEATURE_TOGGLES = [
    'vis-manglende-arbeidserfaring-boks',
    'skjul-yrke',
    'skjul-kompetanse',
    'skjul-utdanning',
    'skjul-arbeidserfaring',
    'skjul-spraak',
    'skjul-sted'
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
