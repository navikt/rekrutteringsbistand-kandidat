export const skalViseModal = (
    status: String,
    antallStillinger: number | null,
    besatteStillinger: number,
    kanEditere: boolean,
    antallStillingerVedSisteAvsluttOppdragBekreftelse: number | null
) => {
    return (
        status === 'ÅPEN' &&
        antallStillinger != null &&
        antallStillinger > 0 &&
        besatteStillinger >= antallStillinger &&
        kanEditere &&
        (antallStillingerVedSisteAvsluttOppdragBekreftelse == null ||
            antallStillingerVedSisteAvsluttOppdragBekreftelse >= antallStillinger)
    );
};
