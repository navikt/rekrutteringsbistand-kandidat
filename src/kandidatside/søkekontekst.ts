export type StateFraNyttKandidatsøk =
    | {
          search?: string;
          markerteKandidater?: string[];
          kandidater?: string[];
      }
    | undefined;

export type Søkekontekst =
    | {
          kontekst: 'fraAutomatiskMatching';
          stillingsId: string;
      }
    | {
          kontekst: 'fraKandidatsøk';
          søk?: string;
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteMedStilling';
          stillingsId: string;
          søk?: string;
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteUtenStilling';
          kandidatlisteId: string;
          søk?: string;
      }
    | {
          kontekst: 'fraNyttKandidatsøk';
          søk?: string;
          kandidater?: string[];
          markerteKandidater?: string[];
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk';
          kandidatlisteId: string;
          kandidater?: string[];
          søk?: string;
          markerteKandidater?: string[];
      };

export const hentSøkekontekst = (
    stillingsIdFraUrl: string | undefined,
    kandidatlisteIdFraUrl: string | undefined,
    fraNyttKandidatsøk: boolean,
    fraAutomatiskMatching: boolean,
    søkeparametreFraGammeltSøk: string,
    stateFraNyttSøk?: StateFraNyttKandidatsøk
): Søkekontekst => {
    if (fraAutomatiskMatching && stillingsIdFraUrl) {
        return {
            kontekst: 'fraAutomatiskMatching',
            stillingsId: stillingsIdFraUrl,
        };
    }
    if (fraNyttKandidatsøk) {
        if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk',
                kandidatlisteId: kandidatlisteIdFraUrl,
                søk: stateFraNyttSøk?.search,
                kandidater: stateFraNyttSøk?.kandidater,
                markerteKandidater: stateFraNyttSøk?.markerteKandidater,
            };
        } else {
            return {
                kontekst: 'fraNyttKandidatsøk',
                søk: stateFraNyttSøk?.search,
                kandidater: stateFraNyttSøk?.kandidater,
                markerteKandidater: stateFraNyttSøk?.markerteKandidater,
            };
        }
    } else {
        if (stillingsIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteMedStilling',
                stillingsId: stillingsIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteUtenStilling',
                kandidatlisteId: kandidatlisteIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else {
            return { kontekst: 'fraKandidatsøk', søk: søkeparametreFraGammeltSøk };
        }
    }
};
