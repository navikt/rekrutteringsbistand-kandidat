import { Retning } from '../common/sorterbarKolonneheader/Retning';

export enum KandidatlisteSorteringsfelt {
    OpprettetTidspunkt = 'opprettetTidspunkt',
    Tittel = 'tittel',
}

export type Kandidatlistesortering = {
    felt: KandidatlisteSorteringsfelt;
    retning: Retning;
};
