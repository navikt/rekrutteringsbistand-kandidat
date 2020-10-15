import { Kandidatlistestatus } from '../../kandidatlistetyper';

export const skalViseModal = (
    status: Kandidatlistestatus,
    antallStillinger: number | null,
    besatteStillinger: number,
    kanEditere: boolean,
    antallStillingerVedSisteAvsluttOppdragBekreftelse?: number
) => {
    return (
        status === Kandidatlistestatus.Åpen &&
        antallStillinger !== null &&
        antallStillinger > 0 &&
        besatteStillinger >= antallStillinger &&
        kanEditere &&
        antallStillingerVedSisteAvsluttOppdragBekreftelse === undefined
    );
};
