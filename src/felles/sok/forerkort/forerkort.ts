interface Forerkort {
    tekst: string;
    kode: string;
}

const alleForerkort: Array<Forerkort> = [
    { kode: 'B', tekst: 'Personbil' },
    { kode: 'BE', tekst: 'Personbil med tilhenger' },
    { kode: 'C', tekst: 'Lastebil' },
    { kode: 'CE', tekst: 'Lastebil med tilhenger' },
    { kode: 'C1', tekst: 'Lett lastebil' },
    { kode: 'C1E', tekst: 'Lett lastebil med tilhenger' },
    { kode: 'D', tekst: 'Buss' },
    { kode: 'DE', tekst: 'Buss med tilhenger' },
    { kode: 'D1', tekst: 'Minibuss' },
    { kode: 'D1E', tekst: 'Minibuss med tilhenger' },
    { kode: 'A', tekst: 'Tung motorsykkel' },
    { kode: 'A1', tekst: 'Lett motorsykkel' },
    { kode: 'A2', tekst: 'Mellomtung motorsykkel' },
    { kode: 'AM', tekst: 'Moped' },
    { kode: 'T', tekst: 'Traktor' },
    { kode: 'S', tekst: 'Snøscooter' },
];

const visningstekst: (Forerkort) => string = forerkort => `${forerkort.kode} - ${forerkort.tekst}`;

export const erGyldigForerkort: (string) => boolean = value =>
    alleForerkort.map(forerkort => visningstekst(forerkort)).includes(value);

const flatten: <T>(listOfLists: T[][]) => T[] = listOfLists =>
    listOfLists.reduce((acc, list) => [...acc, ...list], []);

const erEksaktMatchPaaKode: (string, Forerkort) => boolean = (query, forerkort) =>
    forerkort.kode.toLowerCase() === query.toLowerCase();

const erDelvisMatchPaaKode: (string, Forerkort) => boolean = (query, forerkort) =>
    !erEksaktMatchPaaKode(query, forerkort) &&
    forerkort.kode.toLowerCase().includes(query.toLowerCase());

const erMatchPaaStartAvTekst: (string, Forerkort) => boolean = (query, forerkort) =>
    !erEksaktMatchPaaKode(query, forerkort) &&
    !erDelvisMatchPaaKode(query, forerkort) &&
    forerkort.tekst.toLowerCase().startsWith(query.toLowerCase());

const erDelvisMatchPaaTekst: (string, Forerkort) => boolean = (query, forerkort) =>
    !erEksaktMatchPaaKode(query, forerkort) &&
    !erDelvisMatchPaaKode(query, forerkort) &&
    !erMatchPaaStartAvTekst(query, forerkort) &&
    visningstekst(forerkort)
        .toLowerCase()
        .includes(query.toLowerCase());

export const forerkortSuggestions: (string) => Array<string> = query =>
    flatten([
        alleForerkort.filter(forerkort => erEksaktMatchPaaKode(query, forerkort)),
        alleForerkort.filter(forerkort => erDelvisMatchPaaKode(query, forerkort)),
        alleForerkort.filter(forerkort => erMatchPaaStartAvTekst(query, forerkort)),
        alleForerkort.filter(forerkort => erDelvisMatchPaaTekst(query, forerkort)),
    ]).map(forerkort => visningstekst(forerkort));
