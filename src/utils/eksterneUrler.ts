import { Miljø, getMiljø } from './miljøUtils';

export const arbeidsrettetOppfølgingUrl =
    getMiljø() === Miljø.ProdGcp
        ? 'https://veilarbpersonflate.intern.nav.no'
        : 'https://veilarbpersonflate.intern.dev.nav.no';

export const lastNedCvUrl =
    getMiljø() === Miljø.ProdGcp
        ? 'https://pam-personbruker-veileder.intern.nav.no/cv/pdf?fnr='
        : 'https://pam-personbruker-veileder.intern.dev.nav.no/cv/pdf?fnr=';
