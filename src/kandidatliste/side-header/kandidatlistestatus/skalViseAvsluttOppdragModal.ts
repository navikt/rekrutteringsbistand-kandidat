import { Kandidatlistestatus } from '../../domene/Kandidatliste';

export const skalViseModal = (
    status: Kandidatlistestatus,
    antallStillinger: number | null,
    besatteStillinger: number,
    kanEditere: boolean,
    harAvbrutt: boolean
) => {
    return (
        status === Kandidatlistestatus.Åpen &&
        antallStillinger !== null &&
        antallStillinger > 0 &&
        besatteStillinger >= antallStillinger &&
        kanEditere &&
        !harAvbrutt
    );
};
