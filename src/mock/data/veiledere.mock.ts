export type Veileder = {
    ident: string;
    navn: string;
    fornavn: string;
    etternavn: string;
    epost: string;
    navKontor: string;
};

export const meg: Veileder = {
    ident: 'Z123456',
    navn: 'Clark Kent',
    fornavn: 'Clark',
    etternavn: 'Kent',
    epost: 'clark.kent@trygdeetaten.no',
    navKontor: '0239',
};

export const enVeileder: Veileder = {
    ident: 'X123456',
    navn: 'Bruce Wayne',
    fornavn: 'Bruce',
    etternavn: 'Wayne',
    epost: 'bruce.wayne@trygdeetaten.no',
    navKontor: '2222',
};

export const enAnnenVeileder: Veileder = {
    ident: 'Y123456',
    navn: 'Peter Parker',
    fornavn: 'Peter',
    etternavn: 'Parker',
    epost: 'peter.parker@trygdeetaten.no',
    navKontor: '3333',
};
