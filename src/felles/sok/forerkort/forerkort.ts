interface Forerkort {
    tekst: string,
    kode: string
}

const alleForerkort: Array<Forerkort> = [
    { kode: 'B', tekst: 'B - Personbil'},
    { kode: 'BE', tekst: 'BE - Personbil med tilhenger'},
    { kode: 'C', tekst: 'C - Lastebil'},
    { kode: 'CE', tekst: 'CE - Lastebil med tilhenger'},
    { kode: 'C1', tekst: 'C1 - Lett lastebil'},
    { kode: 'C1E', tekst: 'C1E - Lett lastebil med tilhenger'},
    { kode: 'D', tekst: 'D - Buss'},
    { kode: 'DE', tekst: 'DE - Buss med tilhenger'},
    { kode: 'D1', tekst: 'D1 - Minibuss'},
    { kode: 'D1E', tekst: 'D1E - Minibuss med tilhenger'},
    { kode: 'A', tekst: 'A - Tung motorsykkel'},
    { kode: 'A1', tekst: 'A1 - Lett motorsykkel'},
    { kode: 'A2', tekst: 'A2 - Mellomtung motorsykkel'},
    { kode: 'AM', tekst: 'AM - Moped'},
    { kode: 'T', tekst: 'T - Traktor'},
    { kode: 'S', tekst: 'S - Snøscooter'},
];

export const erGyldigForerkort: (string) => boolean = (value) => (
    alleForerkort.map(forerkort => forerkort.tekst).includes(value)
);

const flatten: <T>(listOfLists: T[][]) => T[] = (listOfLists) => (
    listOfLists.reduce((acc, list) => [...acc, ...list], [])
);

const erEksaktMatchPaaKode: (string, Forerkort) => boolean = (query, forerkort) => (
    forerkort.kode.toLowerCase() === query.toLowerCase()
);

const erDelvisMatchPaaKode: (string, Forerkort) => boolean = (query, forerkort) => (
    !erEksaktMatchPaaKode(query, forerkort) && forerkort.kode.toLowerCase().includes(query.toLowerCase())
);

const erDelvisMatchPaaTekst: (string, Forerkort) => boolean = (query, forerkort) => (
    !erEksaktMatchPaaKode(query, forerkort) && !erDelvisMatchPaaKode(query, forerkort) && forerkort.tekst.toLowerCase().includes(query.toLowerCase())
);

export const forerkortSuggestions: (string) => Array<string> = (query) => (
    flatten([
        alleForerkort.filter(forerkort => erEksaktMatchPaaKode(query, forerkort)),
        alleForerkort.filter(forerkort => erDelvisMatchPaaKode(query, forerkort)),
        alleForerkort.filter(forerkort => erDelvisMatchPaaTekst(query, forerkort))
    ]).map(forerkort => forerkort.tekst)
);
