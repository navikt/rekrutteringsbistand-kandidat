import { Retning } from '../common/sorterbarKolonneheader/Retning';

export enum KandidatlisteSorteringsfelt {
    OpprettetTidspunkt = 'OpprettetTidspunkt',
    Tittel = 'Tittel',
}

export type Kandidatlistesortering = {
    felt: KandidatlisteSorteringsfelt;
    retning: Retning;
};
