export const skalViseModal = (
    modalHarBlittLukket: boolean,
    status: String,
    antallStillinger: number | null,
    besatteStillinger: number,
    kanEditere: boolean
) => {
    return (
        !modalHarBlittLukket &&
        status === 'ÅPEN' &&
        antallStillinger != null &&
        antallStillinger > 0 &&
        besatteStillinger >= antallStillinger &&
        kanEditere
    );
};
