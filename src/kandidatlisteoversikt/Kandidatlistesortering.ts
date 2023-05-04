import { Retning } from '../kandidatliste/liste-header/sorterbarKolonneheader/Retning';

export enum KandidatlisteSorteringsfelt {
    OpprettetTidspunkt = 'OpprettetTidspunkt',
    Tittel = 'Tittel',
    OpprettetAv = 'OpprettetAv',
    AntallKandidater = 'AntallKandidater',
}

export type Kandidatlistesortering = {
    felt: KandidatlisteSorteringsfelt;
    retning: Retning;
};
