export const skalViseModal = (
    status: String,
    antallStillinger: number | null,
    besatteStillinger: number,
    kanEditere: boolean,
    antallStillingerVedSisteAvsluttOppdragBekreftelse?: number
) => {
    return (
        status === 'ÅPEN' &&
        antallStillinger !== null &&
        antallStillinger > 0 &&
        besatteStillinger >= antallStillinger &&
        kanEditere &&
        (antallStillingerVedSisteAvsluttOppdragBekreftelse === undefined ||
            antallStillingerVedSisteAvsluttOppdragBekreftelse < antallStillinger)
    );
};
